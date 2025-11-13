import { Component, OnInit,OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit,OnDestroy {
  

  isUser : boolean = false;
  isSiteManager : boolean = false;
  name : String

  constructor(
    private authService : AuthService,
    private router : Router) { }

  ngOnInit() {    
    this.authService.isLoggedIn.subscribe(loggedin => {
      this.isUser = loggedin 
    })
    this.authService.isSiteManager.subscribe(siteManager => {
      this.isSiteManager = siteManager
    })

    this.authService.currentUser.subscribe(user => {
      if(user){
        this.name = user.name
      }else{
        this.name = null;
      }      
    })
  }

  ngOnDestroy(): void {
    this.authService.isLoggedIn.unsubscribe();
    this.authService.isSiteManager.unsubscribe();
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/'])
  }

}
