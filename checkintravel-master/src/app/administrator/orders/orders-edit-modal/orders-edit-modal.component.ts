import { Component, OnInit, Input } from '@angular/core';
import { Flight, FlightsService } from 'src/app/services/flights.service';
import { User, UsersService } from 'src/app/services/users.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FlashMessagesService } from 'angular2-flash-messages';
import { OrdersService } from 'src/app/services/orders.service';
import { FlightCombination, FlightCombinationsService } from 'src/app/services/flight-combinations.service';

@Component({
  selector: 'app-orders-edit-modal',
  templateUrl: './orders-edit-modal.component.html',
  styleUrls: ['./orders-edit-modal.component.scss']
})
export class OrdersEditModalComponent implements OnInit {

  @Input() order: any;

  submitted: Boolean = false
  // directions: string[] = ['one way', 'two way']
  flights: FlightCombination[];
  customers: User[];  

  editForm: FormGroup

  constructor(
    private flightsService: FlightCombinationsService,
    private usersService: UsersService,
    public activeModal: NgbActiveModal,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private flashMessage: FlashMessagesService,
    private ordersService : OrdersService
  ) { }

  ngOnInit() {
    this.flightsService.get().subscribe((result: any) => {
      this.logger.debug('Orders - getFlights result : ' + JSON.stringify(result, null, 2))
      this.flights = result.data as FlightCombination[]
    })

    this.usersService.getUsers().subscribe((result: any) => {
      this.logger.debug('Orders - getUsers result : ' + JSON.stringify(result, null, 2))
      this.customers = result.data as User[]
    })

    if (this.order && !this.isEmpty(this.order)) {

      this.editForm = this.formBuilder.group({
        combination : [this.order.flight],
        // direction : [this.order.direction],
        // return : [this.order.return],
        customer : [this.order.customer],
        orderDate : [this.order.order_dt],
        // seats: [this.order.seats, [Validators.required]],
        adults: [this.order.orderedSeats.adults],
        infants: [this.order.orderedSeats.infatns],
        phone : [this.order.details.phone],
        email : [this.order.details.email],
        country : [this.order.details.country],
        // orderId: [String(this.order.orderId.airline) + String(this.order.orderId.number), [Validators.required]],
        // departure: [this.dateAdapter.fromModel(departureDate), [Validators.required]],
        // departureTime: [this.ngbTimeService.fromModel(departureDate), [Validators.required]],
        // arrival: [this.dateAdapter.fromModel(arrivalDate), [Validators.required]],
        // arrivalTime: [this.ngbTimeService.fromModel(arrivalDate), [Validators.required]],
        // price: [this.order.price, [Validators.required]],
        // sale: [this.order.isOnSale],
        // costPrice: [this.order.costPrice],
        // salePrice: [this.order.salePrice],
       
        // direction: [this.order.direction, [Validators.required]],
        // origin: [this.order.origin, [Validators.required]],
        // destination: [this.order.destination, [Validators.required]]
      })

    } else {
      this.editForm = this.formBuilder.group({
        // departure : [''],
        // direction : [''],
        // return : [''],
        combination:[''],
        customer : [''],
        orderDate : [''],
        // seats: [0, [Validators.required]],
        adults: [0, [Validators.required]],
        infants: [0, [Validators.required]],
        // orderId: ['', [Validators.required]],
        // departure: ['', [Validators.required]],
        // departureTime: [{ hour: 12, minute: 0 }, [Validators.required]],
        // arrival: ['', [Validators.required]],
        // arrivalTime: [{ hour: 12, minute: 0 }, [Validators.required]],
        // price: [0, [Validators.required]],
        // sale: [false],
        // costPrice: [0],
        // salePrice: [0],
        
        // direction: [this.directions, [Validators.required]],
        // origin: [this.origins, [Validators.required]],
        // destination: [this.destinations, [Validators.required]]
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

  onUpdate() {
    this.submitted = true
    this.logger.debug("Update Pressed")

    if (this.editForm.invalid) {
      this.logger.debug("Update current values : " + JSON.stringify(this.editForm.value, null, 2))
      this.flashMessage.show("Please fix a field", { cssClass: 'alert-danger', timeout: 5000 })
      return;
    }

    this.spinnerService.show();
    this.logger.debug("Update : values : " + JSON.stringify(this.editForm.value,null,2))
    this.ordersService.updateOrder(this.order && !this.isEmpty(this.order) ? this.order._id : null, this.editForm.value).subscribe((result: any) => {
      this.spinnerService.hide();
      if (!result.success) {
        this.logger.error("Order update error : " + JSON.stringify(result))
      }
      else {
        this.logger.debug("Update OK")
        this.activeModal.close("Update OK")
      }

      this.activeModal.close('Order Updated')
    })


  }



  // // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

}
