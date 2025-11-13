import { Injectable } from '@angular/core';

import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';


export interface Location {
  country: {
    hebrewName: String,
    englishName: String
  },
  airport: {
    hebrewName: String,
    englishName: String
  },
  terminal :String,
  id : any
}

@Injectable({
  providedIn: 'root'
})
export class LocationsService {

  result: Location[]

  constructor(
    private http: HttpClient,
    private common : CommonService
    ) {

  }

  getLocations() {
    //TODO: remove http url start    
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/locations");
    //return this.http.get(this.common.GLOBAL('CONFIG_URL') + "/api/locations").map(result => this.result = result.json().data);
  }

  updateLocation(id,loc){
    if(id){
      return this.http.put(this.common.GLOBAL('CONFIG_URL') + '/api/locations/'+id,loc)
    }else{
      return this.http.post(this.common.GLOBAL('CONFIG_URL') + '/api/locations',loc)
    }    
  }

  deleteLocation(id){
    //TODO: remove http url start
    return this.http.delete(this.common.GLOBAL('CONFIG_URL') + "/api/locations/"+id)
  }
  
}
