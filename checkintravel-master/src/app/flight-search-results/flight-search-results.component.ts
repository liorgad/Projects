import { Component, OnInit } from '@angular/core';
import { FlightSearchService, SearchParameters } from '../services/flight-search.service';
import { CustomerDataService } from '../services/customer-data.service';
import { FlightCombination } from '../services/flight-combinations.service';
import { Flight } from '../services/flights.service';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-flight-search-results',
  templateUrl: './flight-search-results.component.html',
  styleUrls: ['./flight-search-results.component.scss']
})
export class FlightSearchResultsComponent implements OnInit {  

  isClient : boolean = false

  constructor( 
    private authService :AuthService  
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((result : boolean)=>{
      this.isClient = result;
    })
  }

}
