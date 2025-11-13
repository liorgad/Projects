import { Component, OnInit } from '@angular/core';
import { NgbDate, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { LocationsService } from 'src/app/services/locations.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { FlightSearchService, SearchParameters } from 'src/app/services/flight-search.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { CustomerDataService } from 'src/app/services/customer-data.service';
import { AuthService } from 'src/app/services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  searchForm: FormGroup

  // fromDate: NgbDate;
  // toDate: NgbDate; 

  selectedDestination: any
  selectedPassengers: number
  selectedOrigin: any

  dp: any
  radioModel: number = 1

  passengers: Number[]
  locations: Object[]
  dateAdapter: NgbDateNativeAdapter

  constructor(private locationService: LocationsService,
    private spinnerService: Ng4LoadingSpinnerService,
    private router: Router,
    private logger: NGXLogger,
    private searchService: FlightSearchService,
    private formBuilder: FormBuilder,
    private dataService :CustomerDataService,
    private authService : AuthService,
    private flashService : FlashMessagesService
     ) {    
    this.dateAdapter = new NgbDateNativeAdapter();

    this.searchForm = formBuilder.group({
      origin: ['מקור'],
      destination: ['יעד'],
      fromDate: [],
      toDate: [],
      adults: ['מבוגרים'],
      infants: ['תינוקות']
    })
  }

  ngOnInit() {
    // Access the Data Service's getUsers() method we defined
    this.locationService.getLocations()
      .subscribe((res: any) => {
        this.locations = res.data;
      });

    this.authService.isLoggedIn.subscribe((isLoggedin : boolean)=>{

      if(isLoggedin){
        let seatLimit = this.authService.currentUserValue.seatLimit.valueOf()
        seatLimit++;
        this.passengers = _.range(1,seatLimit);
      }else{
        this.passengers = _.range(1,8);
      }
    })      
  }

  // // convenience getter for easy access to form fields
  get c() { return this.searchForm.controls; }

  get v() { return this.searchForm.value; }


  getName(location) {
    return location.country.hebrewName + ", " + location.airport.hebrewName + " (" + location.airport.englishName + ")";
  }  

  onSelectedPassenger(number) {
    this.selectedPassengers = number;
  };

  onSelectedDestination(dest) {
    this.selectedDestination = dest;
  };

  onSelectedOrigin(orig) {
    this.selectedOrigin = orig
  };

  onSwapOrgiginDest() {

    this.logger.debug("Swap directions")

    if (this.c.origin.value && this.c.destination.value) {
      let temp = this.c.origin.value
      this.c.origin.setValue(this.c.destination.value);
      this.c.destination.setValue(temp)
    }
    else {
      this.logger.error("swap error: Origin or Destination not select");
    }
  }

  onRadioClick(val) {
    if(val==1){
      this.c.toDate.setValue(null);
    }
    this.radioModel = val;
  }

  onSearchClick() {

    this.logger.debug("Search");

    if (this.searchForm.touched && this.searchForm.valid) {


      let searchParameters: SearchParameters = {
        origin: this.v.origin._id,
        destination: this.v.destination._id,
        fromDate: this.v.fromDate ? this.dateAdapter.toModel(this.v.fromDate).toDateString() : null,
        toDate: this.v.toDate ? this.dateAdapter.toModel(this.v.toDate).toDateString() : null,
        adults: _.isNumber(this.v.adults) ? this.v.adults : 0,
        infants: _.isNumber(this.v.infants) ? this.v.infants : 0
      }

      let customerSearchData ={
        origin: this.v.origin,
        destination: this.v.destination,
        fromDate: this.v.fromDate ? this.dateAdapter.toModel(this.v.fromDate).toDateString() : null,
        toDate: this.v.toDate ? this.dateAdapter.toModel(this.v.toDate).toDateString() : null,
        adults: _.isNumber(this.v.adults) ? this.v.adults : 0,
        infants: _.isNumber(this.v.infants) ? this.v.infants : 0
      }

      this.dataService.SelectedOrderVal.searchParameters = searchParameters;
      this.dataService.SelectedOrderVal.seats.adults =searchParameters.adults
      this.dataService.SelectedOrderVal.seats.infants =searchParameters.infants
      this.dataService.CustomerParamerters.next(customerSearchData)
      this.dataService.SelectedOrder.next(this.dataService.SelectedOrderVal)

      this.logger.debug("Sending Search parameters : " + JSON.stringify(searchParameters, null, 2))
      
      this.spinnerService.show();
      this.searchService.searchFlights(searchParameters).subscribe((result: any) => {

        if(result.success){
          this.router.navigate(['results']);
        }else{
          this.logger.debug("Search false, " + JSON.stringify(result))
          this.flashService.show("Flights not found, " + result.message,{ cssClass: 'alert-danger', timeout: 5000 })
        }
        
        this.spinnerService.hide()    
      })
    }
    else {
      this.logger.debug("No value selected")
      
    }

    
  }
}
