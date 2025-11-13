import { FlightCombination } from "../services/flight-combinations.service";
import { User } from "../services/users.service";
import { Order } from "../services/orders.service";
import { Credentials } from "../services/auth.service";


export interface CustomerOrderData {
    flight : FlightCombination,
    seats : {
        adults : Number,
        infants : Number
    },
    details : {
        email : String,
        country : String,
        phone : String,
        isConfirmed : boolean,
        passengers? : any[] 
    },
    registeredUser : Credentials,    
    searchParameters : any,
    isServerConfirmed : boolean,
    orderResult : any
}
