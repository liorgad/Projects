import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../../services/validate.service'
import { AuthService } from '../../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { Role, RolesService } from 'src/app/services/roles.service';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup
  submitted = false;

  roles: Role[]

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private rolesService: RolesService,
    private formBuilder: FormBuilder,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      selectedRole: ['', [Validators.required]],
      manager: [''],
      phone: [''],
      seatLimit: [''],
      fixedPrice: [''],
      currentPrice: [''],
      initialCredit: ['']
    })

    this.rolesService.getRoles().subscribe((res: any) => {
      this.roles = res.data as Role[]
      console.log('register :' + JSON.stringify(this.roles))
    })
  }

  selectRole(role) {
    //this.selectedRole = role
    console.log("selected role : " + JSON.stringify(role))
  }

  isValid(controlName) {
    return this.registerForm.get(controlName).invalid && this.registerForm.get(controlName).touched;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }


  onRegisterSubmit() {

    this.logger.debug('onRegisterSubmit() : ' + JSON.stringify(this.registerForm.value))

    this.submitted = true;

    const user = this.registerForm.value;    


    this.logger.debug('onRegisterSubmit : ' + JSON.stringify(user))

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    // Register user
    this.logger.debug('registering user...')
    this.authService.registerUser(user).subscribe(
      (data: any) => {
        this.logger.debug('register result : ' + JSON.stringify(data))
        if (data.success) {
          //this.flashMessage.show('User registered and can now login', { cssClass: 'alert-success', timeout: 5000 });
          this.router.navigate([{ outlets: { admin: ['users'] } }]);        
        }else{
          this.flashMessage.show('Something went wrong, User not registered, Msg: ' + data.message, { cssClass: 'alert-danger', timeout: 5000 });
        }        
      },
      (error : any) =>{
        this.logger.error('error : ' + error.messages );
        this.flashMessage.show('Something went wrong  ' + error.messages, { cssClass: 'alert-danger', timeout: 5000 });
      });

  }

}
