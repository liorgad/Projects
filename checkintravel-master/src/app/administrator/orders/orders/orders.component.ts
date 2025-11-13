import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { OrdersService, Order } from 'src/app/services/orders.service';
import { OrdersEditModalComponent } from '../orders-edit-modal/orders-edit-modal.component';
import { OrdersDeleteModalComponent } from '../orders-delete-modal/orders-delete-modal.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  orders: Order[] 

  constructor(    
    private logger :NGXLogger, 
    private spinnerService: Ng4LoadingSpinnerService,
    private ordersService : OrdersService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.loadOrders()
  }

  openOrderEditModal(order){
    this.logger.debug("open Edit Modal for : " + JSON.stringify(order))
    const modalRef = this.modalService.open(OrdersEditModalComponent);    
    modalRef.componentInstance.order = order;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadOrders();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  openOrderDeleteModal(order){
    this.logger.debug("open Delete Modal for : " + JSON.stringify(order))
    const modalRef = this.modalService.open(OrdersDeleteModalComponent);
    modalRef.componentInstance.id = order._id;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadOrders();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  addOrder(){
    this.orders = [...this.orders,{}as Order ]
  }

  loadOrders(){
    this.ordersService.getOrders()
    .subscribe((result:any )=> {
      this.logger.debug('LoadOrders result : ' + JSON.stringify(result,null,2));
      this.orders = result.data         
    })
  }


}
