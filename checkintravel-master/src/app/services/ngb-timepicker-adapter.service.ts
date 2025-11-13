import { Injectable } from '@angular/core';
import {NgbTimeStruct, NgbTimeAdapter} from '@ng-bootstrap/ng-bootstrap';


@Injectable({
  providedIn: 'root'
})
export class NgbTimepickerAdapterService extends NgbTimeAdapter<Date> {  

  toModel(time: NgbTimeStruct): Date {
    if (!time) {
      return null;
    }

    const d = new Date();

    d.setHours(time.hour);
    d.setMinutes(time.minute);
    d.setSeconds(time.second);

    return d;    
  }

  fromModel(value : Date): NgbTimeStruct{
    if(!value){
      return null;
    }

    return{
      hour : value.getHours(),
      minute : value.getMinutes(),
      second : value.getSeconds()
    };
  }
}
