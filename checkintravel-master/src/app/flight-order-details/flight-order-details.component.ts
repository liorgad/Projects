import { Component, OnInit } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { CustomerDataService } from '../services/customer-data.service';
import { FlightCombination } from '../services/flight-combinations.service';
import { NGXLogger } from 'ngx-logger';
import { CustomerOrderData } from '../interfaces/order';
import { AuthService } from '../services/auth.service';
import { FlightSearchService } from '../services/flight-search.service';
import { Router } from '@angular/router';
import * as _ from 'lodash'
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-flight-order-details',
  templateUrl: './flight-order-details.component.html',
  styleUrls: ['./flight-order-details.component.scss']
})
export class FlightOrderDetailsComponent implements OnInit {
 

  flight : FlightCombination
  customerOrder : CustomerOrderData
  numbers : Number[]
  passengers : any[] = []
  email : String
  country : String
  tel : String
  terms : boolean = false
  isClient : boolean = false
  genderSelected : boolean = false
  username : String
  password : String
  placedOrder : boolean = false

  
  cc_number : number
  cc_holdername : string
  cc_month : number
  cc_year : number
  cc_cvv : number





  constructor(
    private spinnerService: Ng4LoadingSpinnerService,   
    private data : CustomerDataService,
    private logger : NGXLogger,
    private authService : AuthService,
    private flightSearchService : FlightSearchService,     
    private  router : Router,    
    private flashService : FlashMessagesService
  ) { }

  ngOnInit() {

    this.authService.isLoggedIn.subscribe(isLoggedIn =>{      
      this.isClient = isLoggedIn
     }  )

    this.data.SelectedFlight.subscribe((flight:FlightCombination)=>{
      this.logger.debug("FlightOrderDetailsComponent flight loaded : " + JSON.stringify(flight,null,2))
      this.flight = flight
    })

    this.data.SelectedOrder.subscribe((customerOrder : CustomerOrderData)=>{
      this.logger.debug("FlightOrderDetailsComponent customerOrder loaded : " + JSON.stringify(customerOrder,null,2))
      this.customerOrder = customerOrder
      let adults = Number(this.customerOrder.seats.adults);
      let infants = Number(this.customerOrder.seats.infants)
      let totalPassengers = adults+infants
      this.numbers = Array(totalPassengers).fill(totalPassengers,0,totalPassengers-1).map((x,i)=>i);
      
      for(let i=0;i< adults; i++){
        this.passengers.push({firstname : '',lastname : '',gender : '',isInfant : false})
      }

      for(let i=0;i < infants ; i++){
        this.passengers.push({firstname : '',lastname : '',gender : 'I',isInfant : true})
      }
          
      this.logger.debug("passengers : " + JSON.stringify(this.passengers,null,2))      
    })

    this.placedOrder = false
  }

  onPayment(){    
    
    this.placedOrder = true
    this.logger.debug("Payment details : " + JSON.stringify(this.passengers,null,2) + " " + this.email + " " + this.country + " " + this.tel + " " + this.terms)

    if(this.terms)
    {   
      this.data.SelectedOrderVal.details = {
        email : this.email,
        country : this.country,
        isConfirmed : this.terms,
        phone : this.tel,
        passengers : this.passengers
      }    
      
      let isLoggedIn = this.authService.loggedIn()

      this.data.SelectedOrderVal.registeredUser = isLoggedIn ? this.authService.currentUserValue : null   

      const order:any = {
        flight : { _id : this.data.SelectedOrderVal.flight._id},
        seats : this.data.SelectedOrderVal.seats,
        details : this.data.SelectedOrderVal.details,
        customer : this.data.SelectedOrderVal.registeredUser, 
      }

      if(this.hasCreditDetails()){
        order.credit = {
          number : this.cc_number,
          name : this.cc_holdername,
          date : {
            month : this.cc_month,
            year : this.cc_year
          },
          cvv : this.cc_cvv
        }   
      }

      // if these is customer credit
      if(isLoggedIn && !_.isEmpty(this.username) && !_.isEmpty(this.password)){
        _.assign(order,{username : this.username, password : this.password})
      }

      order.seats.adults =  _.isNumber(order.seats.adults) ?  order.seats.adults : 0
      order.seats.infants = _.isNumber(order.seats.infants) ? order.seats.infants : 0      

      this.logger.debug("Placing order for : " + JSON.stringify(order,null,2))      
      
      this.spinnerService.show()
      this.flightSearchService.placeOrder(order).subscribe((orderResult : any)=>{

        this.spinnerService.hide()
        this.logger.debug("Place order result : " + JSON.stringify(orderResult,null,2))
        this.passengers = [];

        if(orderResult.success){

          this.placedOrder = false
          this.data.SelectedOrderVal.isServerConfirmed = true
          this.data.SelectedOrderVal.orderResult = orderResult.data
          this.data.SelectedOrder.next(this.data.SelectedOrderVal)          
          this.router.navigate(['confirmation']);          
          
        }else{
          this.flashService.show("Order Not place please check details or contact support, " + orderResult.message,{ cssClass: 'alert-danger', timeout: 3000 })
          this.logger.error("Error placing order, " + orderResult.message)
          this.placedOrder = false
        }        
      })

    }
  }

  // firstname: String,
  // lastname: String,
  // gender: {type:String, default:'M'},
  // isInfant:  mongoose.SchemaTypes.Boolean

  getMRGenderImage(item){
    if(_.isEmpty(item.gender)){
      return "../../assets/images/flight-order-details/MR-GOLD.png"
    }else{
      if(item.gender=="M"){
        return "../../assets/images/flight-order-details/MR-BLUE.png"
      }else {
        return "../../assets/images/flight-order-details/MR-GOLD.png"
      }
    }
  }

  getMSGenderImage(item){
    if(_.isEmpty(item.gender)){
      return "../../assets/images/flight-order-details/MRS-GOLD.png"
    }else{
      if(item.gender=="F"){
        return "../../assets/images/flight-order-details/MRS-BLUE.png"
      }else {
        return "../../assets/images/flight-order-details/MRS-GOLD.png"
      }
    }
  }

  getINFGenderImage(item){
    if(_.isEmpty(item.gender)){
      return "../../assets/images/flight-order-details/INFANT-GOLD.png"
    }else{
      if(item.gender=="I"){
        return "../../assets/images/flight-order-details/INFANT-BLUE.png"
      }else {
        return "../../assets/images/flight-order-details/INFANT-GOLD.png"
      }
    }
  }

  onMRClicked(item){
    item.gender = "M";
    item.isInfant=false
    this.genderSelected = true
  }

  onMSClicked(item){
    item.gender = "F"
    item.isInfant = false
    this.genderSelected = true
  }

  onInfClicked(item){
    item.gender = "I"
    item.isInfant=true
    this.genderSelected = true
  }

  trackByIndex(index: number, obj: any): any {
    return index;
  }

  hasCreditDetails(){    
    return !_.isEmpty(this.cc_number) && !_.isEmpty(this.cc_holdername) && !_.isEmpty(this.cc_month) && !_.isEmpty(this.cc_year) && !_.isEmpty(this.cc_cvv)
  }

  hasClientDetails(){ 
    return this.isClient && !_.isEmpty(this.username) && !_.isEmpty(this.password)
  }
}
