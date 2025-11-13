import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

export interface Flight{
  flightId : {
    airline : String,
    number : Number
}, 
_id: string,
id : string,  
airlineName : any, 
departure : Date,
// return : Date,
arrival : Date,
// costPrice : Number,
// salePrice : Number,
price : number,
isOnSale : boolean,
seats : number,
direction : number,
origin : any,
destination : any
}

export interface Airline{
  _id : string,
  name : string,
  img : string
}

@Injectable({
  providedIn: 'root'
})
export class FlightsService {

  constructor(
    private http:HttpClient,
    private common : CommonService
    ) { }

  getFlights(){
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + '/api/flights');
  } 

  updateFlight(id,flight){
    if(id){
      return this.http.put(this.common.GLOBAL('CONFIG_URL') + '/api/flights/'+id,flight)
    }else{
      return this.http.post(this.common.GLOBAL('CONFIG_URL') + '/api/flights',flight)
    }    
  }

  deleteFlight(id){
    return this.http.delete(this.common.GLOBAL('CONFIG_URL') + '/api/flights/'+id)
  }

  getAirlines(){
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + '/api/flights/airlines');
  }

  updateAirline(id,airline){
    if(id){
      return this.http.put(this.common.GLOBAL('CONFIG_URL') + '/api/flights/airlines/'+id,airline)
    }else{
      return this.http.post(this.common.GLOBAL('CONFIG_URL') + '/api/flights/airlines',airline)
    }    
  }

  deleteAirline(id){
    return this.http.delete(this.common.GLOBAL('CONFIG_URL') + '/api/flights/airlines/'+id)
  }
}
