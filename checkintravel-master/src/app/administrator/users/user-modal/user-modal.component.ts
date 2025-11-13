import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Role } from 'src/app/models/role';
import { RolesService } from 'src/app/services/roles.service';
import { UsersService, User } from 'src/app/services/users.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as _ from 'lodash';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.scss']
})
export class UserModalComponent implements OnInit {

  editForm: FormGroup

  @Input() user: any
  roles: Role[]
  selectedRole: Role
  isNew: boolean = false


  template: string =
    `<img class="custom-spinner-template" src="../../../assets/images/LOAD-PAGE.gif">`

  constructor(
    public activeModal: NgbActiveModal,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private rolesService: RolesService,
    private usersService: UsersService,
    private spinnerService: Ng4LoadingSpinnerService,
    private flashMessage: FlashMessagesService,
    private authService: AuthService
  ) { }

  ngOnInit() {

    this.rolesService.getRoles().subscribe((res: any) => {
      this.roles = res.data as Role[]
    })

    if (this.user && !_.isEmpty(this.user)) {

      this.editForm = this.formBuilder.group({
        email: [this.user.email, [Validators.required, Validators.email]],
        password: [this.user.password, [Validators.required, Validators.minLength(6)]],
        roles: [this.user.role],
        manager: [this.user.manager],
        phone: [this.user.phone],
        seatLimit: [this.user.seatLimit],
        fixedPrice: [this.user.fixedPrice],
        currentPrice: [this.user.currentPrice],
        initialCredit: [this.user.initialCredit]
      })

      this.selectedRole = this.user.role
    } else {
      this.isNew = true
      this.editForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        roles: [''],
        manager: [''],
        phone: [''],
        seatLimit: [0],
        fixedPrice: [0],
        currentPrice: [0],
        initialCredit: [0]
      })

    }
  }

  get f() { return this.editForm.controls }

  closeModal() {
    this.logger.debug('Modal : ' + JSON.stringify(this.user))
    this.activeModal.close('Modal Closed');
  }

  onUpdate() {
    this.logger.debug('Update pressed')

    this.logger.debug('User modal value : ' + JSON.stringify(this.editForm.value,null,2))

    const user: any = {
      email: this.f.email.value,
      role: this.f.roles.value,
      manager: this.f.manager.value,
      phone: this.f.phone.value,
      seatLimit: this.f.seatLimit.value,
      fixedPrice: this.f.fixedPrice.value,
      currentPrice: this.f.currentPrice.value,
      initialCredit: this.f.initialCredit.value,
    }

    if (!this.f.password.pristine) {
      user.password = this.f.password.value
    }

    this.spinnerService.show();
    this.logger.debug("User update : " + JSON.stringify(user, null, 2))
    if (this.isNew) {
      this.authService.registerUser(user).subscribe((result: any) => {
        this.logger.debug(JSON.stringify(result))
        this.spinnerService.hide();

        if (result.success) {
          this.logger.debug("Add Successfull")
          //this.flashMessage.show('Update Successfull' , { cssClass: 'alert-danger', timeout: 5000 });
        } else {
          this.logger.debug("Add Failed")
          //this.flashMessage.show('Something went wrong, User not registered, Msg: ' + result.message, { cssClass: 'alert-danger', timeout: 5000 });
        }

        this.activeModal.close('')
      })
    } else {
      this.usersService.updateUser(this.user._id, user).subscribe((result: any) => {
        this.logger.debug(JSON.stringify(result))
        this.spinnerService.hide();

        if (result.success) {
          this.logger.debug("Update Successfull")
          //this.flashMessage.show('Update Successfull' , { cssClass: 'alert-danger', timeout: 5000 });
        } else {
          this.logger.debug("Update Failed")
          //this.flashMessage.show('Something went wrong, User not registered, Msg: ' + result.message, { cssClass: 'alert-danger', timeout: 5000 });
        }


        this.activeModal.close('')
      })
    }
  }

  isCurrentRole(role) {
    this.logger.debug("isCurrentRole : " + JSON.stringify(role) + " user.role : " + JSON.stringify(this.user.role))
    this.logger.debug("returning : " + JSON.stringify(this.user.role.name == role.name))
    return this.user.role.name == role.name
  }
}
