import { Component, OnInit } from '@angular/core';

// Import the DataService
import { LocationsService } from '../services/locations.service';

import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { FlightSearchService, SearchParameters } from '../services/flight-search.service';
import { NgbDateNativeAdapter, NgbDatepicker, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { CustomerDataService } from '../services/customer-data.service';


@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.scss']
})
export class FlightSearchComponent implements OnInit {

  hoveredDate: NgbDate;

  fromDate: NgbDate;
  toDate: NgbDate;

  // selectedDestination : string = "יעד"
  selectedDestination: any
  selectedPassengers: number
  selectedOrigin: any
  //selectedDate: Date = Date.now()
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
    private data : CustomerDataService
    ) {

    this.passengers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    this.dateAdapter = new NgbDateNativeAdapter();
  }

  ngOnInit() {
    // Access the Data Service's getUsers() method we defined
    this.locationService.getLocations()
      .subscribe((res: any) => {
        //this.logger.debug(res);
        this.locations = res.data;
      });
  }

  onSelectedPassenger(number) {
    //console.log("Selected passangers " + number);
    // this.selectedPassengers = "נוסעים " + String(number);
    this.selectedPassengers = number;
  };

  onSelectedDestination(dest) {
    // this.selectedDestination =dest.country.hebrewName +", " + dest.airport.hebrewName
    this.selectedDestination = dest;
  };

  onSelectedOrigin(orig) {
    this.selectedOrigin = orig
  };

  onSwapOrgiginDest() {
    if (this.selectedOrigin && this.selectedDestination) {
      let temp = this.selectedOrigin;
      this.selectedOrigin = this.selectedDestination;
      this.selectedDestination = temp;

      //console.log("Origin : " + JSON.stringify(this.selectedOrigin));
      //console.log("Destination : " + JSON.stringify(this.selectedDestination));

      // let t = this.getName(this.selectedDestination)
      //console.log(t)
    }
    else {
      this.logger.error("swap error: Origin or Destination not select");
    }

  }

  getName(location) {
    return location.country.hebrewName + ", " + location.airport.hebrewName + " (" + location.airport.englishName + ")";
  }

  onClickSearch() {

    // this.spinnerService.show();

    
    this.logger.debug("Search");

    // let queryParams: SearchParameters = {
    //   origin: this.selectedOrigin._id,
    //   destination: this.selectedDestination._id,
    //   date: this.dateAdapter.toModel(this.dp),
    //   direction: this.radioModel,
    //   passengers: this.selectedPassengers
    // }

    // this.logger.debug("Sending Search parameters : " + JSON.stringify(queryParams, null, 2))

    // this.searchService.searchFlights(queryParams).subscribe((result: any) => {
    //   this.router.navigate(['results']);
    //   this.spinnerService.hide()
    // })
    // this.router.navigate(['/searchResults',{origin : this.selectedOrigin, destination : this.selectedDestination, date : this.selectedDate, passengers : this.selectedPassengers }])
  }  
}
