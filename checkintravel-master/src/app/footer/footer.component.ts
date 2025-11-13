import { Component, OnInit } from '@angular/core';
import { FlightSearchService } from '../services/flight-search.service';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  isSiteManager : boolean = false
  email : String

  constructor(
    private registerService :FlightSearchService,
    private logger : NGXLogger,
    private authService : AuthService
  ) { }

  ngOnInit( ) {
    this.authService.isSiteManager.subscribe(siteManager => {
      this.isSiteManager = siteManager
    })
  }

  registerMail(){
    if(this.email && !_.isEmpty(this.email)){
      this.registerService.registerMail(this.email).subscribe((result : any)=>{
        this.logger.debug("Register Mail result : " + JSON.stringify(result,null,2))
        this.email = null;
      })
    }
  }

}
