import { Component, OnInit} from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CustomerDataService } from 'src/app/services/customer-data.service';
import { CustomerOrderData } from 'src/app/interfaces/order';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

import {TestClass} from '../test';

@Component({
  selector: 'app-confirmation-details',
  templateUrl: './confirmation-details.component.html',
  styleUrls: ['./confirmation-details.component.scss']
})
export class ConfirmationDetailsComponent implements OnInit {

  orderData: CustomerOrderData
  hasReturnFlight: boolean = false
  banner: String
  isClient: boolean = false
  hasDeparture : boolean = false
  

  image: string = "../../../assets/images/SIMBOLE-BLUE.png"

  // airlineLogo : string = "../../../assets/images/logo/aegean_logo.jpg"
  departureAirlineLogo: string
  returnAirlineLogo: string

  constructor(
    private logger: NGXLogger,
    private dataService: CustomerDataService,
    private authService: AuthService,
  ) {

  }

  

  ngOnInit() {

    if(TestClass.isTest){
      this.orderData = TestClass.body;
      this.isClient = TestClass.isClient

      this.hasReturnFlight = !_.isNil(this.orderData.flight.return)
      this.hasDeparture = !_.isNil(this.orderData.flight.departure)

      this.departureAirlineLogo = this.getAirlineImage(this.departureAirlineLogo, this.orderData.flight.departure);

      this.returnAirlineLogo = this.hasReturnFlight ? this.getAirlineImage(this.hasReturnFlight, this.orderData.flight.return) : ''  
      
      this.authService.isLoggedIn.subscribe((loggedin: boolean) => {
        this.isClient = loggedin;
        this.banner = this.isClient ? "../../../assets/images/confirmation/banner_clients.png" : "../../../assets/images/confirmation/banner_logo.png"
      })
      return
    }

    this.dataService.SelectedOrder.subscribe(orderData => {
      this.logger.debug("Confirmation details order : " + JSON.stringify(orderData, null, 2))
      this.orderData = orderData
      this.hasReturnFlight = !_.isNil(orderData.flight.return)
      this.hasDeparture = !_.isNil(orderData.flight.departure)

      this.departureAirlineLogo = this.getAirlineImage(this.departureAirlineLogo, this.orderData.flight.departure);

      this.returnAirlineLogo = this.hasReturnFlight ? this.getAirlineImage(this.hasReturnFlight, this.orderData.flight.return) : ''       
    })

    this.authService.isLoggedIn.subscribe((loggedin: boolean) => {
      this.isClient = loggedin;
      this.banner = this.isClient ? "../../../assets/images/confirmation/banner_clients.png" : "../../../assets/images/confirmation/banner_logo.png"
    })
  }

  getTitle(passenger) {
    if (passenger.gender) {
      return passenger.gender == 'M' ? 'MR.' : passenger.gender == 'F' ? 'MRS.' : ''
    }
    return '';
  }

  getImage(passenger) {
    if (passenger.isInfant) {
      return "../../../assets/images/confirmation/INFANT-GOLD.png"
    } else if (passenger.gender == "M") {
      return "../../../assets/images/confirmation/MR-GOLD.png"
    } else {
      return "../../../assets/images/confirmation/MRS-GOLD.png"
    }
  }

  onMouseOver() {
    this.banner = "../../../assets/images/confirmation/banner_log_after-press.png"
  }

  onMouseOut() {
    this.banner = "../../../assets/images/confirmation/banner_logo.png"
  }

  getAirlineImage(currentImage, flight) {

    if (_.isEmpty(currentImage)) {
      let base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(flight.airlineName.img.data.data)))
      //let imageDataString = btoa(this.flight.departure.airlineName.img.data.data)
      currentImage = flight.airlineName.img.contentType + ',' + base64String
    }

    return currentImage;
  }

}
