import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { UsersService } from 'src/app/services/users.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-delete-modal',
  templateUrl: './user-delete-modal.component.html',
  styleUrls: ['./user-delete-modal.component.scss']
})
export class UserDeleteModalComponent implements OnInit {

  @Input()userId : string

  constructor(
    public activeModal : NgbActiveModal,
    private logger :NGXLogger,    
    private usersService : UsersService,
    private spinnerService: Ng4LoadingSpinnerService,    
  ) { }

  ngOnInit() {
  }

  onDelete(){
    this.logger.debug('Delete pressed for ' + this.userId)

    this.spinnerService.show();
    this.usersService.deleteUser(this.userId).subscribe((result:any )=>{
      this.logger.debug('User Deleted')
      this.spinnerService.hide();

      if(result.success){
        //this.flashMessage.show('Update Successfull' , { cssClass: 'alert-danger', timeout: 5000 });
      }else{
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
