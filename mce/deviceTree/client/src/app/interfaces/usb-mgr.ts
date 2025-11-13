import { Observable } from 'rxjs';

export interface IUsbMgr {

    getDevices() : Observable<any>
    getDeviceByType() : Observable<any>
}
