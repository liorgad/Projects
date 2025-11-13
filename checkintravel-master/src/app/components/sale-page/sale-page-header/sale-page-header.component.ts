import { Component, OnInit, Input } from '@angular/core';
import { FlightCombination } from 'src/app/services/flight-combinations.service';
import { Router } from '@angular/router';
import { NGXLogger, LoggerConfig } from 'ngx-logger';
import { CustomerDataService } from 'src/app/services/customer-data.service';
import * as _ from 'lodash';


@Component({
  selector: 'app-sale-page-header',
  templateUrl: './sale-page-header.component.html',
  styleUrls: ['./sale-page-header.component.scss']
})
export class SalePageHeaderComponent implements OnInit {

  flight: FlightCombination
  orderImage: string
  departureImage: string = ''
  returnImage: string = ''

  constructor(
    // private  router : Router,
    private logger: NGXLogger,
    private dataService: CustomerDataService
  ) { }

  ngOnInit() {

    this.dataService.SelectedFlight.subscribe((flight: FlightCombination) => {
      this.flight = flight
      this.logger.debug("SalePageHeaderComponent flight : " + JSON.stringify(this.flight, null, 2))
    })

    this.orderImage = "../../assets/images/SIMBOLE-BLUE.png"
  }

  getDepartureAirlineImage() {

    if (_.isEmpty(this.departureImage)) {
      let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(this.flight.departure.airlineName.img.data.data)))
      //let imageDataString = btoa(this.flight.departure.airlineName.img.data.data)
      this.departureImage = this.flight.departure.airlineName.img.contentType + ',' + base64String
    }

    return this.departureImage;
  }

  getReturnAirlineImage() {
    if (!_.isEmpty(this.flight.return)) {
      if (_.isEmpty(this.returnImage)) {
        let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(this.flight.return.airlineName.img.data.data)))
        //let imageDataString = btoa(this.flight.departure.airlineName.img.data.data)
        this.departureImage = this.flight.departure.airlineName.img.contentType + ',' + base64String
      }

      return this.departureImage;
    }
    return ''
  }

}
