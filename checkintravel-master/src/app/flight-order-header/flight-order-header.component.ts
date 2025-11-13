import { Component, OnInit } from '@angular/core';
import { CustomerDataService } from '../services/customer-data.service';
import { NGXLogger } from 'ngx-logger';
import { FlightCombination } from '../services/flight-combinations.service';
import * as _ from 'lodash';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-flight-order-header',
  templateUrl: './flight-order-header.component.html',
  styleUrls: ['./flight-order-header.component.scss']
})
export class FlightOrderHeaderComponent implements OnInit {

  flight:FlightCombination
  hasReturn : boolean =false
  hasDeparture : boolean = false
  isClient : boolean = false
  totalPrice : number =0;
  
  image : string = "../../assets/images/SIMBOLE-BLUE.png"

  constructor(
    private data : CustomerDataService,
    private logger : NGXLogger,
    private authService : AuthService
  ) {   
   }

  ngOnInit() {
    this.data.SelectedFlight.subscribe((flight:FlightCombination)=>{
      this.logger.debug("FlightOrderHeaderComponent flight loaded : " + JSON.stringify(flight,null,2))
      if(flight.return && !_.isNil(flight.return) &&!_.isEmpty(flight.return)){
        this.hasReturn = true
      }
      if(flight.departure && !_.isNil(flight.departure) &&!_.isEmpty(flight.departure)){
        this.hasDeparture = true
      }
      this.flight = flight
    })  
    
    this.authService.isLoggedIn.subscribe((result : boolean)=>{
      this.isClient = result;
    })
  }
}
