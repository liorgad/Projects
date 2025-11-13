import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { CustomerDataService } from 'src/app/services/customer-data.service';
import { AuthService } from 'src/app/services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-sale-page-select-passengers',
  templateUrl: './sale-page-select-passengers.component.html',
  styleUrls: ['./sale-page-select-passengers.component.scss']
})
export class SalePageSelectPassengersComponent implements OnInit {

  selectPassengers: FormGroup

  // fromDate: NgbDate;
  // toDate: NgbDate;   
  selectedPassengers: number

  passengers: Number[]

  constructor(
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private dataService: CustomerDataService,
    private authService: AuthService
  ) {

    this.selectPassengers = formBuilder.group({
      adults: ['מבוגרים'],
      infants: ['תינוקות']
    })
  }

  ngOnInit() {
    // Access the Data Service's getUsers() method we defined

    this.authService.isLoggedIn.subscribe((isLoggedin: boolean) => {

      if (isLoggedin) {
        let seatLimit = this.authService.currentUserValue.seatLimit.valueOf()
        seatLimit++;
        this.passengers = _.range(1, seatLimit);
      } else {
        this.passengers = _.range(1, 8);
      }
    })
  }

  // // convenience getter for easy access to form fields
  get c() { return this.selectPassengers.controls; }

  get v() { return this.selectPassengers.value; }

  onSelectedPassenger(number) {
    this.selectedPassengers = number;
  };

  onContinueClick() {

    // this.spinnerService.show();

    this.logger.debug("Continue to order click");

    if (this.selectPassengers.touched && this.selectPassengers.valid) {

      

      this.dataService.SelectedOrderVal.seats.adults = Number(this.c.adults.value)
      this.dataService.SelectedOrderVal.seats.infants = Number(this.c.infants.value)
      this.dataService.SelectedOrder.next(this.dataService.SelectedOrderVal)

      this.router.navigate(['order']);
    }
    else {
      this.logger.debug("No value selected")
      
    }

    // this.spinnerService.hide()
  }

}
