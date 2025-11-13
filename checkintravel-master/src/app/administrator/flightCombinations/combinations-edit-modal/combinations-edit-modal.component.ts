import { Component, OnInit, Input } from '@angular/core';
import { FlightCombination, FlightCombinationsService } from 'src/app/services/flight-combinations.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FlashMessagesService } from 'angular2-flash-messages';
import { FlightsService, Flight } from 'src/app/services/flights.service';
import {formatDate} from '@angular/common';
import * as _ from 'lodash';

@Component({
  selector: 'app-combinations-edit-modal',
  templateUrl: './combinations-edit-modal.component.html',
  styleUrls: ['./combinations-edit-modal.component.scss']
})
export class CombinationsEditModalComponent implements OnInit {

  @Input() flightComb: FlightCombination;
  @Input() flights: FlightCombination[]

  oneWayFlights: Flight[]

  submitted: Boolean = false

  editForm: FormGroup

  constructor(
    public activeModal: NgbActiveModal,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private flashMessage: FlashMessagesService,
    private flightsService: FlightsService,
    private flightCombinationService : FlightCombinationsService
  ) { }

  ngOnInit() {
    this.flightsService.getFlights().subscribe((result: any) => {
      this.logger.debug("flights result :" + JSON.stringify(result,null,2))
      this.oneWayFlights = result.data as Flight[]
    })

    if (this.flightComb && !_.isEmpty(this.flightComb)) { 
      
      this.logger.debug("Edit flight : " + JSON.stringify(this.flightComb,null,2))

      this.editForm = this.formBuilder.group({

        departure: [this.getFlightName(this.flightComb.departure)],        
        arrival : [this.getFlightName(this.flightComb.return)],                
        price: [this.flightComb.price],
        isOnSale: [this.flightComb.isOnSale],
        // costPrice: [this.flightComb.costPrice],
        salePrice: [this.flightComb.salePrice],
        // seats: [this.flightComb.seats],        
      })

    } else {
      this.editForm = this.formBuilder.group({ 
        departure: ['', [Validators.required]], 
        arrival :[''],       
        price: [0, [Validators.required]],
        isOnSale: [false],
        // costPrice: [0],
        salePrice: [0],
        // seats: [0, [Validators.required]],       
      })
    }
  }

  onUpdate() {
    this.submitted = true
    this.logger.debug("Update Pressed")

    if (this.editForm.invalid) {
      this.logger.debug("Update current vlaues : " + JSON.stringify(this.editForm.value, null, 2))
      this.flashMessage.show("Please fix a field", { cssClass: 'alert-danger', timeout: 5000 })
      return;
    }

    this.spinnerService.show();
    this.logger.debug("Update : values : " + JSON.stringify(this.editForm.value))
    this.flightCombinationService.update(this.flightComb && !_.isEmpty(this.flightComb) ? this.flightComb._id : null, this.editForm.value).subscribe((result: any) => {
      this.spinnerService.hide();
      if (!result.success) {
        this.logger.error("flightCombination update error : " + JSON.stringify(result))
      }
      else {
        this.logger.debug("Update OK")
        this.activeModal.close("Update OK")
      }

      this.activeModal.close('flightCombination Updated')
    })
  }

  // // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  getFlightName(flight){
    if(!_.isNil(flight)){
      return flight.flightId.airline+flight.flightId.number + " " + formatDate(flight.departure,'medium','en-US')
    }
    return '';
  }

}
