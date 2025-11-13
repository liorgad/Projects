import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { FlightSearchService } from './services/flight-search.service';

@Injectable({
  providedIn: 'root'
})
export class PreloadFlightSearchGuard implements Resolve<any> {

  constructor(private flightSeach : FlightSearchService){}

  resolve(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return null;
  }
}
