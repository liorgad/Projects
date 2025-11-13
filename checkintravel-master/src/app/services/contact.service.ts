import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as _ from 'lodash';
import { NGXLogger } from 'ngx-logger';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
    private common : CommonService
  ) { }



  postMessage(firstname,lastname,email,message){
    return this.http.post(this.common.GLOBAL('CONFIG_URL') + "/api/contact",{firstname:firstname,lastname:lastname,email:email,message:message})
  }
}
