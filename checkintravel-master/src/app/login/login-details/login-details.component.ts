import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NGXLogger } from 'ngx-logger';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightSearchService } from 'src/app/services/flight-search.service';
import { ValidateService } from 'src/app/services/validate.service';
import { FlashMessagesService } from 'angular2-flash-messages';


@Component({
  selector: 'app-login-details',
  templateUrl: './login-details.component.html',
  styleUrls: ['./login-details.component.scss']
})
export class LoginDetailsComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  

  constructor(
    private authService: AuthService,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private registerService : FlightSearchService,
    private validateService : ValidateService,
    private flashMessage: FlashMessagesService,) {

    // this.loginForm = new FormGroup({
    //   email: new FormControl(null, Validators.required),
    //   password: new FormControl(null, Validators.required)
    // });
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required],
      register: [false]
    });

    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/login';

  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  isValid(controlName) {
    return this.loginForm.get(controlName).invalid && this.loginForm.get(controlName).touched;
  }

  login() {
    this.logger.debug(this.loginForm.value);

    this.submitted = true;

    if (this.loginForm.valid) {
      this.loading = true;
      this.authService.login(this.loginForm.value)
        .pipe(first())
        .subscribe(
          data => {
            if(data)
            {
              this.logger.debug('return from auth service post credentails :' + JSON.stringify(data))
              if(this.f.register.value){
                if(!this.validateService.validateEmail(this.f.email.value)){
                  // this.flashMessage.show("Please email not valid, email not registered", { cssClass: 'alert-danger', timeout: 5000 })
                }else{
                this.registerService.registerMail(this.f.email.value).subscribe((result : any)=>{
                  this.logger.debug("Login register mail result : " + JSON.stringify(result,null,2))
                })}
              }  
              this.router.navigate(['/']);
            }else{
              this.logger.debug('Wrong password')
              this.error = "Wrong password !"
              this.loading = false;
              this.router.navigate([this.returnUrl]);
            }
           
          },
          error => {
            this.logger.error("Error : " + error)
            this.error = error;
            this.loading = false;
          });
    }
  }

}
