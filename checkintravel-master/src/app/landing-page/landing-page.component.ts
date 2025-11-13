import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  isUser :boolean = false 

  constructor(private authService : AuthService,private logger :NGXLogger) {
    
   }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe(isLoggedIn =>{      
      this.isUser = isLoggedIn
     }  )
  }

}
