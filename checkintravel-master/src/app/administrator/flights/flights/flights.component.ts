import { Component, OnInit } from '@angular/core';
import { FlightsService, Flight } from 'src/app/services/flights.service';
import { NGXLogger } from 'ngx-logger';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlightEditModalComponent } from '../flight-edit-modal/flight-edit-modal.component';
import { FlightDeleteModalComponent } from '../flight-delete-modal/flight-delete-modal.component';

@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss']
})
export class FlightsComponent implements OnInit {

  flights: Flight[] 

  constructor(
    private flightsService: FlightsService,
    private logger : NGXLogger,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.loadFlights()
  }

  openFlightEditModal(flight){   
    
    this.logger.debug("open Edit Modal for : " + JSON.stringify(flight,null,2))    
    const modalRef = this.modalService.open(FlightEditModalComponent);    
    modalRef.componentInstance.flight = flight;    
    modalRef.componentInstance.flights = this.flights;


    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadFlights();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  openFlightDeleteModal(flight){
    this.logger.debug("open Delete Modal for : " + JSON.stringify(flight,null,2))
    const modalRef = this.modalService.open(FlightDeleteModalComponent);
    modalRef.componentInstance.id = flight._id;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadFlights();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  addFlight(){
    this.flights = [...this.flights,{}as Flight ]
  }

  loadFlights(){
    this.flightsService.getFlights()
    .subscribe((result:any )=> {
      this.logger.debug('LoadFlights result : ' + JSON.stringify(result,null,2));
      this.flights = result.data      
    })
  }

  getName(location) {
    if(location){
      return location.country.hebrewName + ", " + location.airport.hebrewName + " (" + location.airport.englishName + ")";
    }
    return '';    
  }
}
