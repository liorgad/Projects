import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-orders-delete-modal',
  templateUrl: './orders-delete-modal.component.html',
  styleUrls: ['./orders-delete-modal.component.scss']
})
export class OrdersDeleteModalComponent implements OnInit {

  @Input()id : string

  constructor(
    public activeModal : NgbActiveModal,
    private logger :NGXLogger, 
    private spinnerService: Ng4LoadingSpinnerService,
    private ordersService : OrdersService  
  ) { }

  ngOnInit() {
  }

  onDelete(){
    this.logger.debug('Delete pressed for ' + this.id)

    this.spinnerService.show();
    this.ordersService.deleteOrder(this.id).subscribe((result:any )=>{
      
      this.spinnerService.hide();

      if(result.success){
        this.logger.debug('Order Deleted')
        //this.flashMessage.show('Update Successfull' , { cssClass: 'alert-danger', timeout: 5000 });
      }else{
        this.logger.debug('Order not Deleted')
        //this.flashMessage.show('Something went wrong, User not registered, Msg: ' + result.message, { cssClass: 'alert-danger', timeout: 5000 });
      }
      this.activeModal.close('')
    })
  }

  closeModal() {
    this.logger.debug('Modal closing ')
    this.activeModal.close('Modal Closed');
  }
}
