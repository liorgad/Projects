import { Component, OnInit, Input } from '@angular/core';
import { Flight, FlightsService, Airline } from 'src/app/services/flights.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LocationsService } from 'src/app/services/locations.service';
import { JsonPipe } from '@angular/common';
import { FlashMessagesService } from 'angular2-flash-messages';
import { NgbTimepickerAdapterService } from 'src/app/services/ngb-timepicker-adapter.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-flight-edit-modal',
  templateUrl: './flight-edit-modal.component.html',
  styleUrls: ['./flight-edit-modal.component.scss']
})
export class FlightEditModalComponent implements OnInit {

  @Input() flight: any;
  @Input() flights: Flight[]

  // origins: Location[] = []
  // destinations: Location[] = []
  locations : Location[]
  airlines : Airline[];
  
  submitted: Boolean = false
  isNew : Boolean = false
  

  dateAdapter: NgbDateNativeAdapter

  editForm: FormGroup

  constructor(
    public activeModal: NgbActiveModal,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private locationService: LocationsService,
    private flashMessage: FlashMessagesService,
    private flightsService: FlightsService,
    private ngbTimeService: NgbTimepickerAdapterService
  ) {
    this.dateAdapter = new NgbDateNativeAdapter();
  }

  ngOnInit() {
    this.locationService.getLocations().subscribe((result: any) => {
      this.logger.debug("locations result :" + JSON.stringify(result,null,2))
      // Object.assign(this.origins, result.data as Location[])
      // Object.assign(this.destinations, result.data as Location[])
      this.locations = result.data;
    })

    this.flightsService.getAirlines().subscribe((result : any) =>{
      this.logger.debug("airlines result :" + JSON.stringify(result,null,2))
      this.airlines = result.data;
    })

    if (this.flight && !this.isEmpty(this.flight)) {

      //let returnDate = this.flight.return
      let departureDate = new Date(this.flight.departure)
      let arrivalDate = this.flight.arrival ? new Date(this.flight.arrival): new Date(Date.now())

      this.editForm = this.formBuilder.group({
        // flightId: [String(this.flight.flightId.airline) + String(this.flight.flightId.number), [Validators.required, Validators.minLength(6)]],
        flightId: [String(this.flight.flightId.airline) + String(this.flight.flightId.number), [Validators.required]],
        airlineName : [this.flight.airlineName],
        departure: [this.dateAdapter.fromModel(departureDate), [Validators.required]],
        departureTime: [this.ngbTimeService.fromModel(departureDate), [Validators.required]],
        // isTwoWay : [!_.isEmpty(this.flight.return)],
        // retrun : [this.flight.return],        
        arrival: [this.dateAdapter.fromModel(arrivalDate), [Validators.required]],
        arrivalTime: [this.ngbTimeService.fromModel(arrivalDate), [Validators.required]],
        price: [this.flight.price, [Validators.required]],
        sale: [this.flight.isOnSale],
        costPrice: [this.flight.costPrice],
        salePrice: [this.flight.salePrice],
        seats: [this.flight.seats, [Validators.required]],
        //direction: [this.flight.direction, [Validators.required]],
        origin: [this.flight.origin, [Validators.required]],
        destination: [this.flight.destination, [Validators.required]]
      })

      // this.selectedOrigin = this.flight.origin
      // this.selectedDestination = this.flight.destination
      // this.selectedDirection = this.flight.direction

    } else {
      this.isNew =true;
      this.editForm = this.formBuilder.group({
        // flightId: ['', [Validators.required, Validators.minLength(6)]],
        flightId: ['', [Validators.required]],
        airlineName : [''],
        departure: ['', [Validators.required]],
        departureTime: [{ hour: 12, minute: 0 }, [Validators.required]],
        isTwoWay : [false],
        return :[],
        arrival: ['', [Validators.required]],
        arrivalTime: [{ hour: 12, minute: 0 }, [Validators.required]],
        price: [0, [Validators.required]],
        sale: [false],
        costPrice: [0],
        salePrice: [0],
        seats: [0, [Validators.required]],
        //direction: [this.directions, [Validators.required]],
        origin: ['', [Validators.required]],
        destination: ['', [Validators.required]]
      })
    }
  }

  private isEmpty(obj) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key))
        return false;
    }
    return true;
  }

  getName(location) {
    if (location) {
      return location.country.hebrewName + ", " + location.airport.hebrewName + " (" + location.airport.englishName + ")";
    }
    return '';
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
    this.flightsService.updateFlight(this.flight && !this.isEmpty(this.flight) ? this.flight._id : null, this.editForm.value).subscribe((result: any) => {
      this.spinnerService.hide();
      if (!result.success) {
        this.logger.error("Flight update error : " + JSON.stringify(result))
      }
      else {
        this.logger.debug("Update OK")
        this.activeModal.close("Update OK")
      }

      this.activeModal.close('Flight Updated')
    })


  }



  // // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

  compareLocation(loc1, loc2) {

    if (this.flight && !this.isEmpty(this.flight)) {
      if (loc1 && loc2) {
        return loc1._id === loc2._id;
      }
    }
    return false
  }

  compareDirection(dir1, dir2) {
    if (this.flight && !this.isEmpty(this.flight)) {
      if (dir1 && dir2) {
        return dir1 === dir2;
      }
    }
    return false
  }
}
