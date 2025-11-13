import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';


export interface Role {
  role: Number,
  name: String,
  id: any
}

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  roles : Role[]

  constructor(
    private http : HttpClient,
    private common : CommonService
    ) { }

  getRoles(){
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/roles")
  }
}
