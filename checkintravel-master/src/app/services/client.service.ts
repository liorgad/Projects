import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from './auth.service';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    private authService : AuthService,
  private common : CommonService
  ) { }

  getOrders() {

    let params = new HttpParams();
    let email = this.authService.currentUserValue.email
    
    if (!_.isUndefined(email) && !_.isNil(email)) {
      params = _.isNil(email) ? params : params.append('email', String(email));
    }    
    

    this.logger.debug("Client get orders Service: " + JSON.stringify(params, null, 2))

    //TODO: remove http url start
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/search/clientOrders", { params: params }).map((result: any) => {
      // return this.http.post(this.common.GLOBAL('CONFIG_URL') + "/api/search/clientOrders",params).map((result: any) => {

      this.logger.debug("Client get orders Service result : " + JSON.stringify(result, null, 2))

      if (result && result.data) {
        return result;
      }
      else {
        return result
      }
    })
      .share()
  }
}
