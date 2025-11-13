import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NGXLogger } from 'ngx-logger';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-summary',
  templateUrl: './client-summary.component.html',
  styleUrls: ['./client-summary.component.scss']
})
export class ClientSummaryComponent implements OnInit {

  loggedin : boolean = false
  siteManager : boolean = false  
  orders : any[]
  name : String
  sum : number = 0
  remainingCredit : number = 0

  @Input()showHello : boolean = false

  constructor(
    private authService : AuthService,
    private logger : NGXLogger,
    private clientService : ClientService
  ) { }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(loggedin => {
      this.loggedin = loggedin    
    })
    this.authService.isSiteManager.subscribe(siteManager => {
      this.siteManager = siteManager
    })

    this.authService.currentUser.subscribe(user => {
      if(user){
        this.name = user.name
      }else{
        this.name = null;
      }  
      
      if(user){
        // this.clientService.getOrders().subscribe((result:any)=>{  
        //   if(result && result.length >0){
        //     this.remainingCredit = Number(result[0].customer.initialCredit) - Number(result[0].customer.usedCredit)
        //   }        
        //   result.forEach(element => 
        //     {
        //       element.orderedSeats = element.details.passengers.filter(p => !p.isInfant).length
        //       this.sum+= Number(element.orderedSeats)              
        //     });
        //   this.logger.debug("Client Summary results : " + JSON.stringify(result,null,2))
        //   this.orders = result
        // })
      }      
    })

    this.clientService.getOrders().subscribe((result:any)=>{  
      //this.logger.debug("ClientSummaryComponent result of getOrders, " + JSON.stringify(result,null,2))
      if(result && result.success && result.data && result.data.length >0){
        this.remainingCredit = Number(result.data[0].customer.initialCredit) - Number(result.data[0].customer.usedCredit)
      }        
      result.data.forEach(element => 
        {
          element.orderedSeats = element.details.passengers.filter(p => !p.isInfant).length
          this.sum+= Number(element.orderedSeats)              
        });
      this.logger.debug("Client Summary results : " + JSON.stringify(result,null,2))
      this.orders = result.data
    })
  }

}
