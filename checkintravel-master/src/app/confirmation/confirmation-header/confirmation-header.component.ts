import { Component, OnInit, OnDestroy } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { CustomerDataService } from 'src/app/services/customer-data.service';
import { AuthService } from 'src/app/services/auth.service';

import {TestClass} from '../test';

@Component({
  selector: 'app-confirmation-header',
  templateUrl: './confirmation-header.component.html',
  styleUrls: ['./confirmation-header.component.scss']
})
export class ConfirmationHeaderComponent implements OnInit, OnDestroy { 

  isClient : boolean = false
  order :any

  constructor(
    private logger : NGXLogger,
    private dataService : CustomerDataService,
    private authService : AuthService
  ) { }

  ngOnInit() {

    if(TestClass.isTest){
      this.order = TestClass.header.orderResult;
      this.isClient = TestClass.isClient
      return
    }

    this.dataService.SelectedOrder.subscribe(orderData =>{
      this.logger.debug("Confirmation header order : " + JSON.stringify(orderData,null,2))      
      this.order = orderData.orderResult 
    })

    this.authService.isLoggedIn.subscribe((result : boolean)=>{
      this.isClient = result;
    })
  }

  ngOnDestroy(): void {
    //this.dataService.SelectedOrder.unsubscribe()
  }

}
