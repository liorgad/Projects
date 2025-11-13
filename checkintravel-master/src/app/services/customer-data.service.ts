import { Injectable } from '@angular/core';
import { FlightCombination } from './flight-combinations.service';
import { Flight } from './flights.service';
import { SearchParameters } from './flight-search.service';
import { BehaviorSubject } from 'rxjs';
import { Order } from './orders.service';
import { CustomerOrderData } from '../interfaces/order';

@Injectable({
  providedIn: 'root'
})
export class CustomerDataService {

  private isSelecetdOrder: BehaviorSubject<boolean>
  private selectedOrder: BehaviorSubject<CustomerOrderData>
  private customerParamerters: BehaviorSubject<any>
  private selectedFlight: BehaviorSubject<FlightCombination>
  private searchResults: FlightCombination[]

  get IsSelectedOrder() { return this.isSelecetdOrder; }
  get SelectedOrder() { return this.selectedOrder; }
  get CustomerParamerters() { return this.customerParamerters; }
  get SelectedFlight() { return this.selectedFlight }
  get SelectedOrderVal() {return this.selectedOrder.value}
  get SearchResults() { return this.searchResults }  
  set SearchResults(results : FlightCombination[]) { this.searchResults = results }

  constructor() {
    this.isSelecetdOrder = new BehaviorSubject<boolean>(false);
    this.selectedOrder = new BehaviorSubject<CustomerOrderData>({
      flight: null,
      seats: {
        adults: 0,
        infants: 0
      },
      details: {
        email: null,
        country: null,
        phone: null,
        isConfirmed: false,
        passengers : null
      },
      registeredUser: null,      
      searchParameters : null,
      isServerConfirmed : false,
      orderResult : null
    });
    this.customerParamerters = new BehaviorSubject<any>({});
    this.selectedFlight = new BehaviorSubject<FlightCombination>(null);
    this.searchResults = [];
  }
}
