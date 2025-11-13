import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlightCombination } from '../services/flight-combinations.service';
import { FlightSearchService } from '../services/flight-search.service';
import {  NGXLogger } from 'ngx-logger';
import { CustomerDataService } from '../services/customer-data.service';

@Component({
  selector: 'app-flight-sales',
  templateUrl: './flight-sales.component.html',
  styleUrls: ['./flight-sales.component.scss']
})
export class FlightSalesComponent implements OnInit {

  flightComb : FlightCombination[]
  hasSales : boolean = false

  constructor(private router : Router,
    private flightSearchService : FlightSearchService,
    private logger : NGXLogger,
    private data : CustomerDataService
    ) { }

  ngOnInit() {
    this.flightSearchService.getSales().subscribe((result:any)=>{
      this.logger.debug('Get sales result : ' + JSON.stringify(result,null,2))
      if(result.data && result.success){
        this.flightComb = result.data;
        this.hasSales = true;
      }      
    })
  }

  onSaleClick(i){
    let flightSale = this.flightComb[i];    
    this.data.SelectedOrderVal.flight = flightSale;
    this.data.SelectedFlight.next(flightSale);
    this.router.navigate(['sale-passengers']);
  }

}
