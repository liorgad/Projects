import { Component, OnInit, Input } from '@angular/core';
import { FlightCombination } from '../services/flight-combinations.service';
import { Flight } from '../services/flights.service';
import { FlightSearchService } from '../services/flight-search.service';
import { NGXLogInterface, NGXLogger } from 'ngx-logger';
import { CustomerDataService } from '../services/customer-data.service';

@Component({
  selector: 'app-flight-search-results-list',
  templateUrl: './flight-search-results-list.component.html',
  styleUrls: ['./flight-search-results-list.component.scss']
})
export class FlightSearchResultsListComponent implements OnInit {

  results : FlightCombination[] = []

  constructor(
    private flightSearchService : FlightSearchService,
    private logger : NGXLogger,
    private dataService : CustomerDataService
  ) { }

  ngOnInit() {
    this.flightSearchService.getResult.subscribe((result : any)=>{
      this.logger.debug("FlightSearchResultsListComponent getResult : "+ JSON.stringify(result))
      //this.dataService.SearchResults = result as FlightCombination[];
      this.results = result.data;
    })
  }

  
}
