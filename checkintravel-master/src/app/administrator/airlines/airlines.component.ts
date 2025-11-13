import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { FlightsService, Airline } from 'src/app/services/flights.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AirlineDeleteModalComponent } from './airline-delete-modal/airline-delete-modal.component';
import { AirlineEditModalComponent } from './airline-edit-modal/airline-edit-modal.component';

@Component({
  selector: 'app-airlines',
  templateUrl: './airlines.component.html',
  styleUrls: ['./airlines.component.scss']
})
export class AirlinesComponent implements OnInit {

  airlines : Airline[]

  constructor(
    private logger : NGXLogger,
    private flightsService : FlightsService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadAirlines()
  }

  openAirlineDeleteModal(airline){
    this.logger.debug("open Delete Modal for : " + JSON.stringify(airline,null,2))
    const modalRef = this.modalService.open(AirlineDeleteModalComponent);
    modalRef.componentInstance.id = airline._id;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadAirlines();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  openAirlineEditModal(airline){
    this.logger.debug("open Edit Modal for : " + JSON.stringify(airline,null,2))    
    const modalRef = this.modalService.open(AirlineEditModalComponent);    
    modalRef.componentInstance.airline = airline;    
    modalRef.componentInstance.airlines = this.airlines;


    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadAirlines();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  addAirline(){
    this.airlines = [...this.airlines,{}as Airline ]
  }

  loadAirlines(){
    this.flightsService.getAirlines().subscribe((result : any)=>{
      this.logger.debug("AirlinesComponent : result : " + JSON.stringify(result,null,2))
      if(result.success){
        this.airlines = result.data
      }else{

      }
    })
  }
}
