import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/share';
import { CustomerOrderData } from '../interfaces/order';
import { ValidateService } from './validate.service';
import { validateConfig } from '@angular/router/src/config';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';

export interface SearchParameters {
  origin: string,
  destination: string,
  fromDate: string,
  toDate: string,
  adults: number,
  infants: number
}


@Injectable({
  providedIn: 'root'
})
export class FlightSearchService {

  query: SearchParameters
  result: BehaviorSubject<any>

  public get getResult(): BehaviorSubject<any> {
    if (this.result && !_.isEmpty(this.result)) {
      return this.result;
    } else {

    }

  }

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    private validateService : ValidateService,
    private authService : AuthService,
    private common : CommonService
    ) {

    this.result = new BehaviorSubject<any>({});
  }

  searchFlights(query: SearchParameters) {   

    let params = new HttpParams();
    if (!_.isUndefined(query) && !_.isNil(query)) {
      params = _.isNil(query.origin) ? params : params.append('origin', query.origin);
      params = _.isNil(query.destination) ? params : params.append('destination', query.destination);
      params = _.isNil(query.toDate) ? params : params.append('toDate', query.toDate);
      params = _.isNil(query.fromDate) ? params : params.append('fromDate', query.fromDate);
      params = _.isNil(query.adults) && _.isNumber(query.adults) ? params : params.append('adults', query.adults.toString());
      params = _.isNil(query.infants) && _.isNumber(query.infants) ? params : params.append('infants', query.infants.toString());
      params = !this.authService.loggedIn() ? params : params.append('username',this.authService.currentUserValue.email.toString())
    }

    this.logger.debug("Search Service: " + JSON.stringify(params, null, 2))
    //TODO: remove http url start
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/search", { params: params }).map((result: any) => {

      this.logger.debug("Search Service result : " + JSON.stringify(result, null, 2))

      if (result && result.data) {
        this.result.next(result);
        return result;
      }
      else {
        return result
      }
    })
      .share()
  }

  getSales() {
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + '/api/search/sales');
  }

  placeOrder(order: any) {
    return this.http.post(this.common.GLOBAL('CONFIG_URL') + "/api/search/placeOrder", order)
  }

  registerMail(email) {

    if(!this.validateService.validateEmail(email)){
      this.logger.error("Register mail not a valid email string " + email)
      return 
    }

    let params = new HttpParams();

    if (!_.isUndefined(email) && !_.isNil(email)) {      
      params = _.isNil(email) ? params : params.append('email', email);
    }

    this.logger.debug("register email: " + JSON.stringify(params, null, 2))
    //TODO: remove http url start
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/registermail", { params: params }).map((result: any) => {

      this.logger.debug("register emailresult : " + JSON.stringify(result, null, 2))

      return result

    })
      .share()
  }
}
