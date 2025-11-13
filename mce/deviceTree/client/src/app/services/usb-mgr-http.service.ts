import { Injectable } from '@angular/core';
import { IUsbMgr } from '../interfaces/usb-mgr';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsbMgrHttpService implements IUsbMgr {


  constructor(private http: HttpClient) { }

  getDevices() {
    try {
      return this.http.get("http://localhost:3000/api/devices")
    } catch (e) {
      console.log(e)
    }
  }

  getDeviceByType() {
    try {
      return this.http.get("http://localhost:3000/api/devicesByType")
    } catch (e) {
      console.log(e)
    }
  }
}
