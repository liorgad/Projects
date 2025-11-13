import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { CommonService } from './common.service';

export interface User {
  email: String,
  password: String,
  role: any,
  manager : String,
  phone : String,
  seatLimit : Number,
  fixedPrice : Number,
  changingPrice : Number,
  inititalCredit : Number,
  usedCredit : Number,
  creation_dt : Date
}


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http : HttpClient,
    private logger :NGXLogger,
    private common : CommonService 
    ) { }

  getUsers(){
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/users")
  }

  updateUser(id,user){
    return this.http.put(this.common.GLOBAL('CONFIG_URL') + "/api/users/"+id,user)
  }

  deleteUser(id){
    return this.http.delete(this.common.GLOBAL('CONFIG_URL') + "/api/users/"+id)
  }

  generateReport(id) {

    let params = new HttpParams();

    if (!_.isUndefined(id) && !_.isNil(id)) {      
      params = _.isNil(id) ? params : params.append('id', id);
    }
    this.logger.debug("generate user report : " + JSON.stringify(params, null, 2))


    //TODO: remove http url start
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/users/report",      
      { params: params, observe: 'response', responseType: 'blob' as 'json', headers:  new HttpHeaders().append('Content-Type','application/json') })     
    
  }  
}