import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { LoggerConfig, NGXLogger } from 'ngx-logger';
import decode from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthService,
    private logger: NGXLogger
  ) { }
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    if (!this.authenticationService.loggedIn()) {
      return false
    }
    const currentUser = this.authenticationService.currentUserValue;

    const tokenPayLoad = decode(currentUser.token)

    if (currentUser && tokenPayLoad) {

      this.logger.debug('AuthGuard : ' + JSON.stringify(route.data))
      this.logger.debug('cuurentUser : ' + JSON.stringify(tokenPayLoad))
      // check if route is restricted by role
      // if (route.data.roles && route.data.roles[0] !== currentUser.role.role) {
      if (route.data.roles && route.data.roles[0] !== tokenPayLoad.role.role) {
        // role not authorised so redirect to home page
        this.router.navigate(['/']);
        return false;
      }

      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
