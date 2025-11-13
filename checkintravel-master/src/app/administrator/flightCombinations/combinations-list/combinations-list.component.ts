import { Component, OnInit } from '@angular/core';
import { Flight } from 'src/app/services/flights.service';
import { NGXLogger } from 'ngx-logger';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FlightCombinationsService, FlightCombination } from 'src/app/services/flight-combinations.service';
import { CombinationsDeleteModalComponent } from '../combinations-delete-modal/combinations-delete-modal.component';
import { CombinationsEditModalComponent } from '../combinations-edit-modal/combinations-edit-modal.component';
import * as _ from 'lodash';
import { HttpResponse } from '@angular/common/http';
import { saveAs} from 'file-saver';

@Component({
  selector: 'app-combinations-list',
  templateUrl: './combinations-list.component.html',
  styleUrls: ['./combinations-list.component.scss']
})
export class CombinationsListComponent implements OnInit {

  flightCombinations: FlightCombination[] 

  constructor(
    private flightCombinationsService: FlightCombinationsService,
    private logger : NGXLogger,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadFlights()
  }

  openFlightEditModal(flight){
    this.logger.debug("open Edit Modal for : " + JSON.stringify(flight))
    const modalRef = this.modalService.open(CombinationsEditModalComponent);    
    modalRef.componentInstance.flightComb = flight;
    modalRef.componentInstance.flights = this.flightCombinations;


    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadFlights();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  openFlightDeleteModal(flight){
    this.logger.debug("open Delete Modal for : " + JSON.stringify(flight))
    const modalRef = this.modalService.open(CombinationsDeleteModalComponent);
    modalRef.componentInstance.id = flight._id;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadFlights();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  addFlight(){
    this.flightCombinations = [...this.flightCombinations,{} as FlightCombination ]
  }

  loadFlights(){
    this.flightCombinationsService.get()
    .subscribe((result:any )=> {
      this.logger.debug('LoadFlightCombinations result : ' + JSON.stringify(result,null,2));
      this.flightCombinations = result.data  as FlightCombination[]    
    })
  }

  onCreateOrdersList(flight){
    this.flightCombinationsService.createOrdersList(flight._id)
    .subscribe(
      (result: HttpResponse<Blob>) => {  
        this.logger.debug(result);
        let name = result.headers.get('content-disposition').split('=')[1]        
        saveAs(result.body, name)
      }
    )    
  }

  // getFlightName(flight){
  //   if(!_.isEmpty(flight)){
  //     return flight.flightId.
  //   }
  // }

}
