import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';

export interface Order{
  direction:String,  
  departure: String,
  return: String,
  customer: String,
  order_dt: Date,  
  orderId: Number
}


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private http: HttpClient,
    private common : CommonService
  ) { }

  getOrders(){
    return this.http.get(this.common.GLOBAL('CONFIG_URL') + '/api/orders')
  }

  deleteOrder(id){
    return this.http.delete(this.common.GLOBAL('CONFIG_URL') + '/api/orders/'+id)
  }

  updateOrder(id,order){
    if(id){
      return this.http.put(this.common.GLOBAL('CONFIG_URL') + '/api/orders/'+id,order)
    }else{
      return this.http.post(this.common.GLOBAL('CONFIG_URL') + '/api/orders',order)
    }  
  }
}
