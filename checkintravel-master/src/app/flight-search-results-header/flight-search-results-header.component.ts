import { Component, OnInit, Input, OnDestroy } from '@angular/core';
//import { SearchParameters } from '../services/flight-search.service';
import { CustomerDataService } from '../services/customer-data.service';
import { NGXLogger } from 'ngx-logger';
//import { NgbTimepickerAdapterService } from '../services/ngb-timepicker-adapter.service';
//import { NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';

@Component({
  selector: 'app-flight-search-results-header',
  templateUrl: './flight-search-results-header.component.html',
  styleUrls: ['./flight-search-results-header.component.scss']
})
export class FlightSearchResultsHeaderComponent implements OnInit,OnDestroy {
  

  searchTerm : any
  //ngbDateService : NgbDateNativeAdapter
  hasReturn : boolean = false

  constructor(
    private data: CustomerDataService,
    private logger : NGXLogger,     
  ) { 
    //this.ngbDateService =new NgbDateNativeAdapter()
  }

  ngOnInit() {
    this.data.CustomerParamerters.subscribe((result : any)=>{      
      this.logger.debug("Search Term before: " + JSON.stringify(result,null,2))
      //result.fromDate = this.ngbDateService.toModel(result.fromDate)

      if(result.toDate && !_.isNil(result.toDate) && !_.isEmpty(result.toDate)){
        this.hasReturn = true
        //result.toDate = this.ngbDateService.toModel(result.toDate)
      }      
      this.searchTerm = result;     
      // this.logger.debug("Search Term after: " + JSON.stringify(this.searchTerm,null,2))
    })
  }

  ngOnDestroy(): void {
    //this.data.CustomerParamerters.unsubscribe()
  }

}
