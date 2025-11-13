import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FlightCombination, FlightCombinationsService } from '../services/flight-combinations.service';
import { Flight } from '../services/flights.service';
import { FlightResult } from '../interfaces/flight-result';
import { NGXLogger } from 'ngx-logger';
import { CustomerDataService } from '../services/customer-data.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-flight-search-results-list-item',
  templateUrl: './flight-search-results-list-item.component.html',
  styleUrls: ['./flight-search-results-list-item.component.scss']
})
export class FlightSearchResultsListItemComponent implements OnInit {

  @Input() flight : FlightCombination 
  
  orderImage : string 
  departureAirlineLogo :string
  returnAirlineLogo : string
  hasReturnFlight : boolean
  flightPrice : number

  constructor(
    private  router : Router,
    private logger : NGXLogger,
    private dataService : CustomerDataService
    ) { }

  ngOnInit() {    
    this.logger.debug("FlightSearchResultsListItemComponent flight : " + JSON.stringify(this.flight,null,2))
    this.orderImage = "../../assets/images/SIMBOLE-BLUE.png"

    this.hasReturnFlight = !_.isNil(this.flight.return)

    this.departureAirlineLogo = this.getAirlineImage(this.departureAirlineLogo,this.flight.departure);

    this.returnAirlineLogo = this.hasReturnFlight ? this.getAirlineImage(this.hasReturnFlight,this.flight.return) : ''

    this.flightPrice = this.flight.price    
  }

  onFlightClick(){
    this.dataService.SelectedOrderVal.flight = this.flight;
    this.dataService.SelectedFlight.next(this.flight)
    this.router.navigate(['order']);
  }

  onMouseOver(){
    this.orderImage = "../../assets/images/SIMBOLE-GOLD.png"
  }

  onMouseOut(){
    this.orderImage = "../../assets/images/SIMBOLE-BLUE.png"
  }

  
  getAirlineImage(currentImage,flight) {

    if (_.isEmpty(currentImage)) {
      let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(flight.airlineName.img.data.data)))
      //let imageDataString = btoa(this.flight.departure.airlineName.img.data.data)
      currentImage = flight.airlineName.img.contentType + ',' + base64String
    }

    return currentImage;
  }
  
}
