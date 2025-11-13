import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Flight } from './flights.service';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';

export interface FlightCombination{
  _id: string,
  id : string,   
  departure : Flight,
  return : Flight,  
  costPrice : number,
  salePrice : number,
  price : number,
  isOnSale : boolean,
  seats : number,   
  availableSeats : any,
  totalPrice : number
  }
  

@Injectable({
  providedIn: 'root'
})
export class FlightCombinationsService {

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    private common : CommonService
  ) {

  }

  get() {
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + '/api/flights/combinations');
  }

  update(id, flight) {
    if (id) {
      return this.http.put(this.common.GLOBAL('CONFIG_URL') + '/api/flights/combinations/' + id, flight)
    } else {
      return this.http.post(this.common.GLOBAL('CONFIG_URL') + '/api/flights/combinations', flight)
    }
  }

  delete(id) {
    return this.http.delete(this.common.GLOBAL('CONFIG_URL') + '/api/flights/combinations/' + id)
  }

  createOrdersList(id) {

    let params = new HttpParams();

    if (!_.isUndefined(id) && !_.isNil(id)) {      
      params = _.isNil(id) ? params : params.append('id', id);
    }
    this.logger.debug("Create orders list : " + JSON.stringify(params, null, 2))


    //TODO: remove http url start
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/flights/combinations/orders",      
      { params: params, observe: 'response', responseType: 'blob' as 'json', headers:  new HttpHeaders().append('Content-Type','application/json') })     
    
  }  
}
