import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs-compat/operators/map';
import 'rxjs/add/operator/catch';
import { Role } from '../services/roles.service'
import decode from 'jwt-decode';
import * as _ from 'lodash';
import { CommonService } from './common.service';


export interface Credentials {
  email: String,
  password: String,
  token: string,
  id: String,
  role: Role,
  name : string,
  seatLimit : Number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<Credentials>
  public currentUser: Observable<Credentials>
  private loggedin: BehaviorSubject<boolean>

  private siteManager: BehaviorSubject<boolean>


  // authToken: any
  // user: any

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    private jwtHelper: JwtHelperService,
    private common : CommonService
    ) {

    this.currentUserSubject = new BehaviorSubject<Credentials>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();

    this.siteManager = new BehaviorSubject<boolean>(false)
    this.loggedin = new BehaviorSubject<boolean>(this.loggedIn());

  }

  public get currentUserValue(): Credentials {
    return this.currentUserSubject.value;
  }

  registerUser(user) {
    this.logger.debug('Sending POST req : ' + JSON.stringify(user))
    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    return this.http.post( this.common.GLOBAL('CONFIG_URL') + '/api/users', user, { headers: headers }).catch(this.errorHandler)
  }

  errorHandler(error : HttpErrorResponse){
    return Observable.throw(error.message || "Server Error")
  }

  login(credentials: any) {

    this.logger.debug('Sending POST ' + JSON.stringify(credentials))

    return this.http.post(this.common.GLOBAL('CONFIG_URL') + '/api/users/login', credentials)
      .pipe(map(
        (result: any) => {
          // login successful if there's a jwt token in the response
          this.logger.debug(JSON.stringify(result))

          // wrong password
          // if (!result.data.success) {
            if (!result.success) {
            this.logout()
            return;
          }
          // login successful if there's a jwt token in the response
          let user = result.data.user
          if (user && user.token) {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.logger.debug('user authenticated sending: ' + JSON.stringify(user))
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);

            const tokenPayload = decode(this.currentUserValue.token)
            //this.logger.debug("AuthService : loggedIn() - tokenPayLoad : " + JSON.stringify(tokenPayload))
            if (tokenPayload.role.role == 1) {
              this.siteManager.next(true)
            }

            this.logger.debug('triggering userLoggedin')
            this.loggedin.next(true)
          }
          else {
            this.logout()
          }

          return user;
        }
      ))
  }

  get isLoggedIn(): BehaviorSubject<boolean> {
    return this.loggedin;
  }

  get isSiteManager(): BehaviorSubject<boolean> {
    return this.siteManager;
  }

  loggedIn() {
    //this.logger.debug("AuthService: current user - " + this.currentUserValue)
    if (!_.isNil(this.currentUserValue) && !_.isNil(this.currentUserValue.token)) {
      const tokenPayload = decode(this.currentUserValue.token)
      //this.logger.debug("AuthService : loggedIn() - tokenPayLoad : " + JSON.stringify(tokenPayload))
      if (tokenPayload.role.role <= 2) {
        this.siteManager.next(!this.jwtHelper.isTokenExpired(this.currentUserValue.token))
      }
      return !this.jwtHelper.isTokenExpired(this.currentUserValue.token)
    }
    return false
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedin.next(false);
    this.siteManager.next(false);
  }
}
