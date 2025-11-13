const mongoose = require('mongoose');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const moment = require('moment');
var Excel = require('exceljs');
const _ = require('lodash');

const ObjectId = mongoose.Types.ObjectId;


const RoleSchema = mongoose.Schema({
    role: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    }
});

const Role = mongoose.model('Role', RoleSchema, 'roles');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    //username: {type:String, require:true},
    creation_dt: {
        type: Date,
        require: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role'
    },
    manager: {
        type: String
    },
    phone: {
        type: String,
        required: true
    },
    seatLimit: {
        type: String,
        required: true
    },
    fixedPrice: Number,
    fixedPriceOneWay: { type: Number, default: 0 },
    fixedPriceTwoWay: { type: Number, default: 0 },
    currentPrice: Number,
    initialCredit: Number,
    usedCredit: {
        type: Number,
        default: 0
    }
});

const User = mongoose.model('User', UserSchema, 'users');

var AirlineSchema = mongoose.Schema({
    name: String,
    img: {
        data: Buffer,
        contentType: String
    },
    create_dt: Date,
});

const Airline = mongoose.model('Airline', AirlineSchema);

const LocationSchema = mongoose.Schema({
    country: {
        hebrewName: String,
        englishName: String
    },
    airport: {
        hebrewName: String,
        englishName: String
    },
    terminal: String
});

const Location = mongoose.model('Location', LocationSchema, 'locations');


const FlightSchema = mongoose.Schema({
    flightId: {
        airline: String,
        number: Number
    },
    airlineName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Airline',
        autopopulate: true
    },
    departure: Date,
    arrival: Date,
    costPrice: Number,
    salePrice: Number,
    price: Number,
    isOnSale: Boolean,
    seats: Number,
    origin: {
        location:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            autopopulate: false
        },
        terminal: String
    },
    destination: {
        location:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Location',
            autopopulate: false
        },
        terminal: String
    },
    orderedSeats: {
        type: Number,
        default: 0
    },
    create_dt: Date,
    orders: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order'
    }]
});
FlightSchema.plugin(require('mongoose-autopopulate'));

const Flight = mongoose.model('Flight', FlightSchema, 'flights');

const FlightCombinationSchema = mongoose.Schema({
    id: Number,
    departure: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        autopopulate: false
    },
    return: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flight',
        autopopulate: false
    },
    costPrice: Number,
    salePrice: Number,
    price: Number,
    isOnSale: Boolean,
    availableSeats: {
        departure: {
            type: Number,
            default: 0
        },
        return: {
            type: Number,
            default: 0
        }
    },
    create_dt: Date,
});

FlightCombinationSchema.plugin(require('mongoose-autopopulate'));

const FlightCombination = mongoose.model('FlightCombination', FlightCombinationSchema, 'flightCombinations');

var PersonSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    gender: {
        type: String,
        default: 'M'
    },
    isInfant: mongoose.SchemaTypes.Boolean
});
//Order Schema
const OrderSchema = mongoose.Schema({
    flight: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'FlightCombination',
        autopopulate: true
    },
    orderedSeats: {
        adults: {
            type: Number,
            default: 0
        },
        infants: {
            type: Number,
            default: 0
        },
    },
    details: {
        email: String,
        country: String,
        isConfirmed: mongoose.SchemaTypes.Boolean,
        phone: String,
        passengers: [PersonSchema]
    },
    customer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        autopopulate: true
    },
    order_dt: Date,
    orderId: String,
    // {
    //   type: Number,
    //   default: 0
    // },
    seats: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    }
});

OrderSchema.plugin(require('mongoose-autopopulate'));

const Order = mongoose.model('orders', OrderSchema, 'orders')


const config = {
    //database: 'mongodb://localhost:27017/checkintravel',
    database: 'mongodb+srv://lior:32533663@cluster0-fprlo.mongodb.net/checkintravel?retryWrites=true',
    secret: 'mysecet'
};

mongoose.set('useFindAndModify', false);
// Connect
mongoose.connect(config.database, {
    useNewUrlParser: true
}).then(
    () => {
        console.log('Connected to database ' + config.database);
    },
    (error) => {
        console.log('Error connecting to database ' + error);
    }
);

mongoose.set('useCreateIndex', true);

console.log('lior')

const runQueries = async function (id) {
    try {
        // let result = await FlightCombination.findById("5c7be3e99dc88c11f4c0c9f1") 
        let result = await FlightCombination.aggregate()
            .match({
                _id: mongoose.Types.ObjectId(id)
            })
            .lookup({
                from: "flights",
                localField: "departure",
                foreignField: "_id",
                as: "departure"
            })
            .lookup({
                from: "flights",
                localField: "return",
                foreignField: "_id",
                as: "return"
            })
            .project({
                "departure.orders": 1,
                "return.orders": 1
            })
            .unwind("departure", "return")
            .unwind("departure.orders", "return.orders")
            .project({
                orders: ["$departure.orders", "$return.orders"]
            })
            .unwind("orders")
            .group({
                _id: null,
                uniqueValues: {
                    $addToSet: "$orders"
                }
            })
            .unwind("$uniqueValues")
            .lookup({
                from: "orders",
                localField: "uniqueValues",
                foreignField: "_id",
                as: "orders"
            })
            .project({
                passengers: "$orders.details.passengers"
            })
            .unwind("passengers")
            .exec()

        console.log(JSON.stringify(result, null, 2));

        let name = await getFlight("5c7be3e99dc88c11f4c0c9f1", result)

        return result;

    } catch (error) {
        console.log(error);
    }
}

const getFlight = async function (id, result) {

    try {
        let flight = await FlightCombination.findById(id)

        let name = flight.departure.origin.airport.englishName + "-" + flight.departure.destination.airport.englishName + " " +
            moment(flight.departure.departure).format("DD MMM") + " " + flight.departure.flightId.airline + " " + moment(flight.departure.departure).format("HH_mm")

        //console.log(JSON.stringify(flight, null, 2));

        console.log(name);

        // construct a streaming XLSX workbook writer with styles and shared strings
        var options = {
            filename: './' + name + '.xlsx',
            useStyles: true,
            useSharedStrings: true
        };
        var workbook = new Excel.stream.xlsx.WorkbookWriter(options);

        workbook.addWorksheet('Sheet 1', {
            properties: {
                showGridLines: true
            }
        });
        var worksheet = workbook.getWorksheet('Sheet 1');

        // { header: 'LastName', key: 'lastname', width: 10 },
        //     { header: 'FirstName', key: 'fisrtname', width: 32 },
        //     { header: 'TITLE', key: 'title', width: 10, outlineLevel: 1 },
        //     { header: name, key: 'flightid', width: 10, outlineLevel: 1 }

        worksheet.columns = [{
            header: 'LastName',
            key: 'lastname'
        },
        {
            header: 'FirstName',
            key: 'firstname'
        },
        {
            header: 'TITLE',
            key: 'title'
        },
        {
            header: name,
            key: 'flightid'
        }
        ];

        result[0].passengers.forEach(element => {
            worksheet.addRow({
                lastname: element.lastname,
                firstname: element.firstname,
                title: element.isInfant ? '' : (element.gender == "M" ? "MR" : "MS")
            }).commit()

        });

        worksheet.commit();

        workbook.commit()
            .then(function () {
                console.log("...Done")
                return;
            });

    } catch (error) {
        console.log(error);
    }
}

const usersReport = async function (email) {
    try {
        let departureSearch = {
            start: moment().startOf('week'),
        }

        let returnSearch = {

            end: moment().add(1, 'week').startOf('week').add(1, 'day')
        }


        let results = await Order.aggregate()
            .lookup({
                from: "users",
                localField: "customer",
                foreignField: "_id",
                as: "customer"
            })
            .unwind('customer')
            .match({
                "customer.email": email
            })
            .project({
                "details.passengers": 1,
                "flight": 1,
                "customer.fixedPrice": 1
            })
            .lookup({
                from: "flightCombinations",
                localField: "flight",
                foreignField: "_id",
                as: "flight"
            })
            .unwind('flight')
            .lookup({
                from: "flights",
                localField: "flight.departure",
                foreignField: "_id",
                as: "flight.departure"
            })
            .unwind('flight.departure')
            .lookup({
                from: "flights",
                localField: "flight.return",
                foreignField: "_id",
                as: "flight.return"
            })
            .unwind('flight.return')
            .match({
                "flight.departure.departure": {
                    $gte: departureSearch.start.toDate()
                }
            })
            .match({
                "flight.return.departure": {
                    $lte: returnSearch.end.toDate()
                }
            })
            .unwind('details.passengers')
            .project({
                flight: "$flight",
                firstname: "$details.passengers.firstname",
                lastname: "$details.passengers.lastname",
                isInfant: "$details.passengers.isInfant",
                price: "$customer.fixedPrice"
            })
            .lookup({
                from: "locations",
                localField: "flight.departure.origin",
                foreignField: "_id",
                as: "flight.departure.origin"
            })
            .unwind('flight.departure.origin')
            .lookup({
                from: "locations",
                localField: "flight.departure.destination",
                foreignField: "_id",
                as: "flight.departure.destination"
            })
            .unwind('flight.departure.destination')
            .lookup({
                from: "locations",
                localField: "flight.return.destination",
                foreignField: "_id",
                as: "flight.return.destination"
            })
            .unwind("flight.return.destination")
            .project({
                "firstname": 1,
                "lastname": 1,
                "isInfant": 1,
                "price": 1,
                "flight.departure.departure": 1,
                "flight.departure.flightId.airline": 1,
                "flight.departure.origin.airport.englishName": 1,
                "flight.departure.destination.airport.englishName": 1,
                "flight.return.departure": 1,
                "flight.return.flightId.airline": 1,
                "flight.return.destination.airport.englishName": 1
            })
            .project({
                firstname: "$firstname",
                lastname: "$lastname",
                isInfant: "$isInfant",
                price: "$price",
                source: "$flight.departure.origin.airport.englishName",
                destination: "$flight.departure.destination.airport.englishName",
                returnToSource: "$flight.return.destination.airport.englishName",
                departure: "$flight.departure.departure",
                return: "$flight.return.departure",
                departureAirline: "$flight.departure.flightId.airline",
                returnAirline: "$flight.return.flightId.airline"
            })

        buildCustomerReport('s@s.s', results)


        console.log(JSON.stringify(results, null, 1));
    } catch (e) {

    }
}

let buildCustomerReport = function (email, data) {
    try {
        // construct a streaming XLSX workbook writer with styles and shared strings
        var options = {
            filename: './' + email + '.xlsx',
            useStyles: true,
            useSharedStrings: true
        };
        var workbook = new Excel.stream.xlsx.WorkbookWriter(options);

        workbook.addWorksheet('Sheet 1', {
            properties: {
                showGridLines: true
            }
        });
        var worksheet = workbook.getWorksheet('Sheet 1');



        worksheet.columns = [{
            header: 'LAST NAME',
            key: 'lastname'
        },
        {
            header: 'FIRST NAME',
            key: 'firstname'
        },
        {
            header: 'REMARK',
            key: 'remark'
        },
        {
            header: 'DATE',
            key: 'date'
        },
        {
            header: 'PRICE IN $',
            key: 'price'
        }
        ];

        data.forEach(element => {
            worksheet.addRow({
                lastname: element.lastname,
                firstname: element.firstname,
                remark: element.source + "-" + element.destination + "-" + element.returnToSource + " (" + element.departureAirline + " " + moment(element.departure).format("HH:mm") + "-" + element.returnAirline + " " + moment(element.return).format("HH:mm") + ")",
                date: moment(element.departure).format("DD.M") + "-" + moment(element.return).format("DD.M"),
                price: element.isInfant ? 75 : element.price
            }).commit()
        })

        worksheet.commit();

        workbook.commit()
            .then(function () {
                console.log("...Done")
                return;
            });

    } catch (error) {
        console.log(error);
    }
}

let test = async function (originCountry, originCountryEng, destinationCountry, destinationCountryEng, fromDate, toDate, origin, destination, adults, children, email) {

    let user = await User.findOne({ email: email }).populate('role');

    const INFANT_PRICE = 75
    isUser = !_.isNil(user)
    isOneWay = _.isNil(toDate)

    let customer_price_one_way = 0
    let customer_price_two_way = 0
    if (isOneWay && isUser) {
        customer_price_one_way = Number(user.fixedPriceOneWay)
    }
    else if (isUser) {
        console.log(user);

        customer_price_two_way = Number(user.fixedPriceTwoWay)
    }
    if (isOneWay) {
        findOneWayFlights(originCountry, originCountryEng, destinationCountry, destinationCountryEng, fromDate, origin, destination, adults, children, email)
    }
    else {
        findTwoWayFlights(originCountry, originCountryEng, destinationCountry, destinationCountryEng, fromDate, toDate, origin, destination, adults, children, email)
    }

}

async function findOneWayFlights(originCountry, originCountryEng, destinationCountry, destinationCountryEng, fromDate, origin, destination, adults, children, email) {

    let user = await User.findOne({ email: email }).populate('role');
    const INFANT_PRICE = 75
    isUser = !_.isNil(user)

    let customer_price_one_way = 0
    if (isUser) {
        customer_price_one_way = Number(user.fixedPriceOneWay)
    }

    let result = await FlightCombination.aggregate()
        .match({ "return": { $ne: null } })
        .lookup({
            from: "flights",
            localField: "departure",
            foreignField: "_id",
            as: "departure"
        })
        .unwind("departure")
        .lookup({
            from: "locations",
            localField: "departure.origin.location",
            foreignField: "_id",
            as: "departure.origin.location"
        })
        .lookup({
            from: "locations",
            localField: "departure.destination.location",
            foreignField: "_id",
            as: "departure.destination.location"
        })
        .lookup({
            from: "airlines",
            localField: "departure.airlineName",
            foreignField: "_id",
            as: "departure.airlineName"
        })
        .unwind("departure.origin.location", "departure.destination.location", "departure.airlineName")
        .match({
            $and: [
                {
                    $or: [{ 'departure.origin.location.country.englishName': { '$regex': originCountryEng } },
                    { "departure.origin.location.country.hebrewName": { '$regex': originCountry } }]
                },
                {
                    $or: [{ 'departure.destination.location.country.englishName': { '$regex': destinationCountryEng } },
                    { "departure.destination.location.country.hebrewName": { '$regex': destinationCountry } }],
                }
            ],

        })
        .match({ "departure.departure": { $gte: moment(fromDate).startOf('day').toDate(), $lt: moment(fromDate).endOf('day').toDate() } })
        .project({
            "_id": 1,
            "departure": {
                "_id": 1,
                "flightId": { $concat: ["$departure.flightId.airline", { $toString: "$departure.flightId.number" }] },
                "airlineName": 1,
                "departure": 1,
                "arrival": 1,
                "salePrice": 1,
                "price": 1,
                "isOnSale": 1,
                "seats": 1,
                "orderedSeats": 1,
                "origin": {
                    "location": {
                        "_id": 1,
                        "country": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "airport": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "terminals": 1
                    },
                    "terminal": 1
                },
                "destination": {
                    "location": {
                        "_id": 1,
                        "country": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "airport": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "terminals": 1
                    },
                    "terminal": 1
                },
            },
            "price": {
                $cond: {
                    // request for a user 
                    if: { $eq: [isUser, true] },

                    then: {
                        $sum: [
                            {
                                $multiply: [
                                    customer_price_one_way,
                                    adults
                                ]
                            },
                            {
                                $multiply: [
                                    children,
                                    INFANT_PRICE
                                ]
                            }
                        ]
                    },
                    // regular search
                    else: {
                        $cond: {
                            if: { $eq: ["$departure.isOnSale", true] },
                            // regular one way on sale
                            then: {
                                $sum: [
                                    { $multiply: [children, INFANT_PRICE] },
                                    {
                                        $multiply: [
                                            "$departure.salePrice",
                                            adults
                                        ]
                                    }
                                ],
                            },
                            // regular one way normal price
                            else: {
                                $sum: [
                                    { $multiply: [children, INFANT_PRICE] },
                                    {
                                        $multiply: [
                                            "$departure.price",
                                            adults
                                        ]
                                    }
                                ],
                            }
                        }

                    }
                }
            },
            "id": 1,
            "return": { $literal: null },
            "salePrice": { $literal: 0 },
            "availableSeats": "$departure.availableSeats",
            "costPrice": { $literal: 0 },
            "salePrice": { $literal: 0 },
            "isOnSale": { $literal: false },
            "seats": { $literal: 0 },
            "totalPrice": { $literal: 0 },
            "availableSeats": {
                "departure": { $subtract: ["$departure.seats", "$departure.orderedSeats"] },
            },
        })
        .match({
            $expr: {
                $gte:
                    [
                        "$departure.seats",
                        { $sum: ["$departure.orderedSeats", adults] }
                    ]
            }
        })
        .exec()

    console.log(JSON.stringify(result, null, 2))

}

async function findTwoWayFlights(originCountry, originCountryEng, destinationCountry, destinationCountryEng, fromDate, toDate, origin, destination, adults, children, email) {

    let user = await User.findOne({ email: email }).populate('role');

    const INFANT_PRICE = 75
    isUser = !_.isNil(user)
    let customer_price_two_way = 0
    if (isUser) {
        customer_price_two_way = Number(user.fixedPriceTwoWay)
    }

    let result = await FlightCombination.aggregate()
        .lookup({
            from: "flights",
            localField: "departure",
            foreignField: "_id",
            as: "departure"
        })
        .unwind("departure")
        .lookup({
            from: "flights",
            localField: "return",
            foreignField: "_id",
            as: "return"
        })
        .unwind("return")
        .lookup({
            from: "locations",
            localField: "departure.origin.location",
            foreignField: "_id",
            as: "departure.origin.location"
        })
        .lookup({
            from: "locations",
            localField: "departure.destination.location",
            foreignField: "_id",
            as: "departure.destination.location"
        })
        .lookup({
            from: "airlines",
            localField: "departure.airlineName",
            foreignField: "_id",
            as: "departure.airlineName"
        })
        .lookup({
            from: "airlines",
            localField: "return.airlineName",
            foreignField: "_id",
            as: "return.airlineName"
        })
        .unwind("departure.origin.location", "departure.destination.location", "departure.airlineName", "return.airlineName")
        .match({
            $and: [
                {
                    $or: [{ 'departure.origin.location.country.englishName': { '$regex': originCountryEng } },
                    { "departure.origin.location.country.hebrewName": { '$regex': originCountry } }]
                },
                {
                    $or: [{ 'departure.destination.location.country.englishName': { '$regex': destinationCountryEng } },
                    { "departure.destination.location.country.hebrewName": { '$regex': destinationCountry } }],
                }
            ]
        })
        .lookup({
            from: "locations",
            localField: "return.origin.location",
            foreignField: "_id",
            as: "return.origin.location"
        })
        .lookup({
            from: "locations",
            localField: "return.destination.location",
            foreignField: "_id",
            as: "return.destination.location"
        })
        .unwind(
            { path: "$return.origin.location", preserveNullAndEmptyArrays: true },
            { path: "$return.destination.location", preserveNullAndEmptyArrays: true }
        )
        // should be only for the same day
        .match({ "departure.departure": { $gte: moment(fromDate).startOf('day').toDate(), $lt: moment(fromDate).endOf('day').toDate() } })
        .match(
            { "return.departure": { $gte: moment(toDate).startOf('day').toDate(), $lt: moment(toDate).endOf('day').toDate() } }
        )
        .project({
            "_id": 1,
            "departure": {
                "_id": 1,
                "flightId": { $concat: ["$departure.flightId.airline", { $toString: "$departure.flightId.number" }] },
                "airlineName": 1,
                "departure": 1,
                "arrival": 1,
                "salePrice": 1,
                "price": 1,
                "isOnSale": 1,
                "seats": 1,
                "orderedSeats": 1,
                "origin": {
                    "location": {
                        "_id": 1,
                        "country": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "airport": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "terminals": 1
                    },
                    "terminal": 1
                },
                "destination": {
                    "location": {
                        "_id": 1,
                        "country": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "airport": {
                            "hebrewName": 1,
                            "englishName": 1
                        },
                        "terminals": 1
                    },
                    "terminal": 1
                },

            },
            "return":
            {
                "_id": 1,
                "flightId": { $concat: ["$return.flightId.airline", { $toString: "$return.flightId.number" }] },
                "airlineName": 1,
                "departure": 1,
                "arrival": 1,
                "salePrice": 1,
                "price": 1,
                "isOnSale": 1,
                "seats": 1,
                "orderedSeats": 1,
                "origin": {
                    "location": 1,
                    "terminal": 1
                },
                "destination": {
                    "location": 1,
                    "terminal": 1
                },
            },
            "price": {
                $cond: {
                    // request for a user 
                    if: { $eq: [isUser, true] },

                    then: {
                        $sum: [
                            {
                                $multiply: [
                                    customer_price_two_way,
                                    adults
                                ]
                            },
                            {
                                $multiply: [
                                    2,
                                    {
                                        $multiply: [
                                            children,
                                            INFANT_PRICE
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    // regular search
                    else: {
                        $cond: {
                            if: { $and: ["$departure.isOnSale", "$return.isOnSale"] },
                            // regular 2 way on sale
                            then: {
                                $sum: [
                                    {
                                        $multiply: [
                                            2,
                                            { $multiply: [children, INFANT_PRICE] }
                                        ]
                                    },
                                    {
                                        $multiply: [
                                            {
                                                $sum: [
                                                    "$departure.salePrice", "$return.salePrice"
                                                ]
                                            },
                                            adults
                                        ]
                                    }
                                ],
                            },
                            // regular 2 way normal price
                            else: {
                                $sum: [
                                    {
                                        $multiply: [
                                            2,
                                            { $multiply: [children, INFANT_PRICE] }
                                        ]
                                    },
                                    {
                                        $multiply: [
                                            {
                                                $sum: [
                                                    "$departure.price", "$return.price"
                                                ]
                                            },
                                            adults
                                        ]
                                    }
                                ],
                            }
                        }
                    }
                }
            },
            "id": 1,
            "salePrice": { $literal: 0 },
            "availableSeats": "$departure.availableSeats",
            "costPrice": { $literal: 0 },
            "salePrice": { $literal: 0 },
            "isOnSale": { $literal: false },
            "seats": { $literal: 0 },
            "totalPrice": { $literal: 0 },
            "availableSeats": {
                "departure": { $subtract: ["$departure.seats", "$departure.orderedSeats"] },
                "return": { $subtract: ["$return.seats", "$return.orderedSeats"] }
            },
        })
        .match({
            $expr: {
                $gte:
                    [
                        { $min: ["$departure.seats", "$return.seats"] },
                        {
                            $max: [
                                { $sum: ["$departure.orderedSeats", adults] },
                                { $sum: ["$return.orderedSeats", adults] }
                            ]
                        }
                    ]
            }
        })

        .exec()

    console.log(JSON.stringify(result, null, 2))
}

let getFlightComb = async function () {
    const flights = await FlightCombination.aggregate()
        .lookup({
            from: "flights",
            localField: "departure",
            foreignField: "_id",
            as: "departure"
        })
        .unwind("departure")
        .lookup({
            from: "flights",
            localField: "return",
            foreignField: "_id",
            as: "return"
        })
        .unwind({ path: "$return", preserveNullAndEmptyArrays: true })
        .project({
            departure: 1,
            return: 1,
            price: 1,
            costPrice: 1,
            isOnSale: { $and: ["$departure.isOnSale", " $return.isOneSale"] },
            salePrice: { $sum: ["$departure.salePrice", "$return.salePrice"] }
        })

    // const flights = await FlightCombination.aggregate()
    //   .lookup({
    //     from: "flights",
    //     localField: "departure",
    //     foreignField: "_id",
    //     as: "departure"
    //   })
    //   .lookup({
    //     from: "flights",
    //     localField: "return",
    //     foreignField: "_id",
    //     as: "return"
    //   })
    //   .unwind("departure", "return")
    //   .project({
    //     departure: 1,
    //     return: 1,
    //     price: {
    //       $cond: {
    //         if: { $eq: ["return", null] },
    //         then: "$departure.price",
    //         else: { $sum: ["$departure.price", "$return.price"] }
    //       }

    //     },
    //     costPrice: {
    //       $cond: {
    //         if: { $eq: ["return", null] },
    //         then: "$departure.costPrice",
    //         else: { $sum: ["$departure.costPrice", "$return.costPrice"] }
    //       }
    //     },
    //     isOnSale: {
    //       $cond: {
    //         if: { $eq: ["return", null] },
    //         then: "$departure.isOnSale",
    //         else: { $and: ["$departure.isOnSale", "$return.isOnSale"] }

    //       }
    //     },
    //     salePrice: {
    //       $cond: {
    //         if: { $eq: ["return", null] },
    //         then: "$departure.salePrice",
    //         else: { $sum: ["$departure.salePrice", "$return.salePrice"] }
    //       }
    //     }
    //   })
    //   .exec()


    console.log(JSON.stringify(flights, null, 2))
}

async function getOrders(id) {
    let orderResult = await Order.aggregate()
        .match({ _id: ObjectId(id) })
        .lookup({
            from: "flightCombinations",
            localField: "flight",
            foreignField: "_id",
            as: "flight"
        })
        .unwind("flight")
        .lookup({
            from: "flights",
            localField: "flight.departure",
            foreignField: "_id",
            as: "flight.departure"
        })
        .unwind("flight.departure")
        .lookup({
            from: "flights",
            localField: "flight.return",
            foreignField: "_id",
            as: "flight.return"
        })
        .unwind("flight.return")
        .lookup({
            from: "locations",
            localField: "flight.departure.origin.location",
            foreignField: "_id",
            as: "flight.departure.origin.location"
        })
        .lookup({
            from: "locations",
            localField: "flight.departure.destination.location",
            foreignField: "_id",
            as: "flight.departure.destination.location"
        })
        .lookup({
            from: "airlines",
            localField: "flight.departure.airlineName",
            foreignField: "_id",
            as: "flight.departure.airlineName"
        })
        .lookup({
            from: "airlines",
            localField: "flight.return.airlineName",
            foreignField: "_id",
            as: "flight.return.airlineName"
        })
        .unwind("flight.departure.origin.location", "flight.departure.destination.location", "flight.departure.airlineName", "flight.return.airlineName")
        .lookup({
            from: "locations",
            localField: "flight.return.origin.location",
            foreignField: "_id",
            as: "flight.return.origin.location"
        })
        .lookup({
            from: "locations",
            localField: "flight.return.destination.location",
            foreignField: "_id",
            as: "flight.return.destination.location"
        })
        .unwind(
            { path: "$flight.return.origin.location", preserveNullAndEmptyArrays: true },
            { path: "$flight.return.destination.location", preserveNullAndEmptyArrays: true }
        )
        .lookup({
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer"
        })
        .unwind('customer')

    if (orderResult.length > 0) {
        orderResult = orderResult[0]
    } else {
        logger.error("order not found")
        res.status(HttpStatus.OK).json(responseBuilder(false, HttpStatus.OK, [], 'order not found !'));
        return
    }

    console.log(JSON.stringify(orderResult, null, 2))

}

async function getCustomerOrders(email) {
    let result = await Order.aggregate()
        .lookup({
            from: "users",
            localField: "customer",
            foreignField: "_id",
            as: "customer"
        }).unwind('customer')
        .match({
            "customer.email": email
        })
        .lookup({
            from: "flightCombinations",
            localField: "flight",
            foreignField: "_id",
            as: "flight"
        }).unwind('flight')
        .lookup({
            from: "flights",
            localField: "flight.departure",
            foreignField: "_id",
            as: "flight.departure"
        }).unwind('flight.departure')
        .lookup({
            from: "flights",
            localField: "flight.return",
            foreignField: "_id",
            as: "flight.return"
        }).unwind('flight.return')
        .lookup({
            from: "locations",
            localField: "flight.departure.origin.location",
            foreignField: "_id",
            as: "flight.departure.origin.location"
        }).unwind('flight.departure.origin.location')
        .lookup({
            from: "locations",
            localField: "flight.departure.destination.location",
            foreignField: "_id",
            as: "flight.departure.destination.location"
        }).unwind('flight.departure.destination.location')
        .lookup({
            from: "locations",
            localField: "flight.return.origin.location",
            foreignField: "_id",
            as: "flight.return.origin.location"
        }).unwind('flight.return.origin.location')
        .lookup({
            from: "locations",
            localField: "flight.return.destination.location",
            foreignField: "_id",
            as: "flight.return.destination.location"
        }).unwind('flight.return.destination.location')

    console.log(JSON.stringify(result, null, 2))
}

async function getFCOrders(id) {
    try {

        // const flights = await FlightCombination.findById(queryParams.id).populate('departure').populate('return');
        // logger.debug("GET flight combinations query result : " + JSON.stringify(flights))  
        let result = await FlightCombination.aggregate()
            .match({
                _id: mongoose.Types.ObjectId(id)
            })
            .lookup({
                from: "flights",
                localField: "departure",
                foreignField: "_id",
                as: "departure"
            })
            .lookup({
                from: "flights",
                localField: "return",
                foreignField: "_id",
                as: "return"
            })
            .unwind("departure", "return")
            // .lookup({
            //     from: "orders",
            //     localField: "departure.orders",
            //     foreignField: "_id",
            //     as: "departure.orders"
            // })
            // .lookup({
            //     from: "orders",
            //     localField: "return.orders",
            //     foreignField: "_id",
            //     as: "return.orders"
            // })
            .project({
                "departure.orders": 1,
                "return.orders": 1
            })
            .project({
                orders: ["$departure.orders", "$return.orders"]
            })
            .unwind("orders")
            .group({
                _id: null,
                uniqueValues: {
                    $addToSet: "$orders"
                }
            })
            .unwind("$uniqueValues")
            .lookup({
                from: "orders",
                localField: "uniqueValues",
                foreignField: "_id",
                as: "orders"
            })
            .project({
                passengers: "$orders.details.passengers"
            })
            .unwind("passengers")

        console.log(JSON.stringify(result, null, 2))

        // let flight = await FlightCombination.findById(id).populate("departure").populate("return")
        //     .populate("departure.origin").populate("departure.origin.location")
        //     .populate("departure.destination").populate("departure.destination.location")

        let flight = await FlightCombination.aggregate()
            .match({
                _id: mongoose.Types.ObjectId(id)
            })
            .lookup({
                from: "flights",
                localField: "departure",
                foreignField: "_id",
                as: "departure"
            })
            .lookup({
                from: "flights",
                localField: "return",
                foreignField: "_id",
                as: "return"
            })
            .unwind("departure", "return")
            .lookup({
                from: "locations",
                localField: "departure.origin.location",
                foreignField: "_id",
                as: "departure.origin.location"
            }).unwind('departure.origin.location')
            .lookup({
                from: "locations",
                localField: "departure.destination.location",
                foreignField: "_id",
                as: "departure.destination.location"
            }).unwind('departure.destination.location')
            .lookup({
                from: "locations",
                localField: "return.origin.location",
                foreignField: "_id",
                as: "return.origin.location"
            }).unwind('return.origin.location')
            .lookup({
                from: "locations",
                localField: "return.destination.location",
                foreignField: "_id",
                as: "return.destination.location"
            }).unwind('return.destination.location')

        flight = flight[0]

        let name = String(flight.departure.origin.location.airport.englishName) + "-" +
            String(flight.departure.destination.location.airport.englishName) + " " +
            moment(flight.departure.departure).format("DD MMM").toString() + " " +
            String(flight.departure.flightId.airline) + " " +
            moment(flight.departure.departure).format("HH_mm").toString()

        console.log(name)
    }
    catch (err) {
        console.log("Error " + JSON.stringify(err))
    }
}

async function getFlightOrders(id) {
    try {
        let flight = await Flight.aggregate()
            .match({
                _id: mongoose.Types.ObjectId(id)
            })
            .lookup({
                from: "locations",
                localField: "origin.location",
                foreignField: "_id",
                as: "origin.location"
            }).unwind('origin.location')
            .lookup({
                from: "locations",
                localField: "destination.location",
                foreignField: "_id",
                as: "destination.location"
            }).unwind('destination.location')
            .project({
                flightId: 1,
                origin: 1,
                destination: 1,
                orders: 1,
            })
            .lookup({
                from: "orders",
                localField: "orders",
                foreignField: "_id",
                as: "orders"
            })
            .unwind("orders")
            .project({
                flightId: 1,
                origin: 1,
                destination: 1,
                passengers: "$orders.details.passengers",
            })
            .unwind("$passengers")
            .group({
                _id: null,
                flightId: { $first: "$flightId" },
                origin: { $first: "$origin" },
                destination: { $first: "$destination" },
                passengers: {
                    $addToSet: "$passengers"
                    //$push : "$passengers"
                }
            })

        if (flight.length > 0) {
            flight = flight[0]
        }
        else {
            return
        }

        console.log(JSON.stringify(flight, null, 2));
        let name = String(flight.origin.location.airport.englishName) + "-" +
            String(flight.destination.location.airport.englishName) + " " +
            moment(flight.departure).format("DD MMM").toString() + " " +
            String(flight.flightId.airline) + String(flight.flightId.number) + " " +
            moment(flight.departure).format("HH_mm").toString()


        console.log(name);

    } catch (e) {
        console.log(e);
    }
}

async function userReportQuery(id) {
    try {
        let results = await Order.aggregate()
            .lookup({
                from: "users",
                localField: "customer",
                foreignField: "_id",
                as: "customer"
            })
            .unwind('customer')
            .match({
                "customer.email": id
            })
            .lookup({
                from: "flightCombinations",
                localField: "flight",
                foreignField: "_id",
                as: "flight"
            })
            .unwind('flight')
            .match({"flight.return": { $ne: null } })
            .lookup({
                from: "flights",
                localField: "flight.departure",
                foreignField: "_id",
                as: "flight.departure"
            })
            .unwind('flight.departure')
            .lookup({
                from: "flights",
                localField: "flight.return",
                foreignField: "_id",
                as: "flight.return"
            })            
            .lookup({
                from: "locations",
                localField: "flight.departure.origin.location",
                foreignField: "_id",
                as: "flight.departure.origin.location"
            })
            .unwind('flight.departure.origin.location')
            .lookup({
                from: "locations",
                localField: "flight.departure.destination.location",
                foreignField: "_id",
                as: "flight.departure.destination.location"
            })
            .unwind('flight.departure.destination.location')
            .unwind({ path: "$flight.return", preserveNullAndEmptyArrays: true })
            .lookup({
                from: "locations",
                localField: "flight.return.destination.location",
                foreignField: "_id",
                as: "flight.return.destination.location"
            })
            .unwind("flight.return.destination.location")           
            .project({
                "details.passengers": 1,
                "flight.departure.flightId": 1,
                "flight.departure.departure": 1,
                "flight.return.flightId": 1,
                "flight.return.departure": 1,
                "flight.departure.origin.location.airport.englishName": 1,
                "flight.departure.destination.location.airport.englishName": 1,
                "flight.return.destination.location.airport.englishName": 1,
                "price": 1,                
                "payment_type": 1
                
            })

            let results2 = await Order.aggregate()
            .lookup({
                from: "users",
                localField: "customer",
                foreignField: "_id",
                as: "customer"
            })
            .unwind('customer')
            .match({
                "customer.email": id
            })
            .lookup({
                from: "flightCombinations",
                localField: "flight",
                foreignField: "_id",
                as: "flight"
            })
            .unwind('flight')
            .match({"flight.return": { $eq: null } })
            .lookup({
                from: "flights",
                localField: "flight.departure",
                foreignField: "_id",
                as: "flight.departure"
            })
            .unwind('flight.departure')                    
            .lookup({
                from: "locations",
                localField: "flight.departure.origin.location",
                foreignField: "_id",
                as: "flight.departure.origin.location"
            })
            .unwind('flight.departure.origin.location')
            .lookup({
                from: "locations",
                localField: "flight.departure.destination.location",
                foreignField: "_id",
                as: "flight.departure.destination.location"
            })
            .unwind('flight.departure.destination.location')             
            .project({
                "details.passengers": 1,
                "flight.departure.flightId": 1,
                "flight.departure.departure": 1,               
                "flight.departure.origin.location.airport.englishName": 1,
                "flight.departure.destination.location.airport.englishName": 1,                
                "price": 1,                
                "payment_type": 1
            }) 

        //console.log(JSON.stringify(results, null, 2));   
        
        //console.log(JSON.stringify(results2,null,2))

        results2.forEach(e => results.push(e))

        console.log(JSON.stringify(results, null, 2));   

        results.forEach(element => {
            let source = element.flight.departure.origin.location.airport.englishName
            let destination = element.flight.departure.destination.location.airport.englishName
            let returnToSource = !_.isEmpty(element.flight.return) ? element.flight.return.destination.location.airport.englishName:""
            let departureAirline = element.flight.departure.flightId.airline + element.flight.departure.flightId.number
            let returnAirline =  !_.isEmpty(element.flight.return) ? (element.flight.return.flightId.airline + element.flight.return.flightId.number) : ""
            element.details.passengers.forEach(p => {
               
                console.log({
                    lastname: p.lastname,
                    firstname: p.firstname,

                    remark:  !_.isEmpty(element.flight.return) ? (source + "-" + destination + "-" + returnToSource +
                        " (" + departureAirline + " " + moment(element.flight.departure.departure).format("HH:mm") +
                        "-" + returnAirline + " " + moment(element.flight.return.departure).format("HH:mm") + ")") :
                        (source + "-" + destination + " (" + departureAirline + " " + moment(element.flight.departure.departure).format("HH:mm") + ")") ,

                    date: moment(element.flight.departure.departure).format("DD.M") + ( !_.isEmpty(element.flight.return) ? ("-" + moment(element.flight.return.departure).format("DD.M")):""),
                    price: p.isInfant ? 75 : p.price,
                    paymentType: element.payment_type
                })             
            })
        })
    } catch (e) {
        console.log(e);
    }
}


let originCountry = "ישראל"
let originCountryEng = "ISR"
let destinationCountry = "קפריסין"
let destinationCountryEng = "Cyprus"
let fromDate = new Date("Thu Jul 11 2019")
//let fromDate = new Date("2019-06-27T06:00:00.000Z")
let toDate = new Date("Thu Jul 15 2019")
let origin = "5bd5da51407ef229b41ced96"
let destination = "5bd5dd59407ef229b41ced97"
let adults = 2
let children = 0
let email = null//"checkintravel.flying@gmail.com"

let orderId = "5d2c65644a6f164e74bd17b8"

//let result = test(originCountry, originCountryEng, destinationCountry, destinationCountryEng, fromDate, toDate, origin, destination, adults, children, email)

//let r = getOrders(orderId)

//getCustomerOrders("test@gmail.com")

//getFCOrders("5d386d5af4c200bc647d1b7f")

//getFlightOrders("5d386ccbf4c200bc647d1b7b")

userReportQuery("moran_aber@yahoo.com")


//getFlightComb()
console.log("From: " + fromDate)
console.log("From day : " + moment(fromDate).startOf('day').toDate().toString());
//console.log("To: " + toDate.toString())
// let results = runQueries("5c7be3e99dc88c11f4c0c9f1")
// let result = usersReport('s@s.s')