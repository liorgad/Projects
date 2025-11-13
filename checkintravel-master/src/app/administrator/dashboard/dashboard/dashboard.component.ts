import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AlertService } from 'src/app/services/alert.service';
import { first } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  // loginForm: FormGroup
  // submitted : boolean = false
  // loading : boolean = false
  // returnUrl: string;


  constructor(
    // private builder: FormBuilder,
    // private route: ActivatedRoute,
    // private router: Router,
    // private authenticationService: AuthService,
    // private alertService: AlertService,
    // private logger : NGXLogger
    ) {
    // this.loginForm = this.builder.group({
    //   email: ['', Validators.required],
    //   password: ['', Validators.required]
    // })
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  // get f() { return this.loginForm.controls; }

  // onSubmit() { 
  //   this.submitted = true;

  //       // stop here if form is invalid
  //       if (this.loginForm.invalid) {
  //           return;
  //       }

  //       this.loading = true;
        
  //       this.authenticationService.login({email : this.f.email.value, password : this.f.password.value})
  //           .pipe(first())
  //           .subscribe(
  //               data => {
  //                   this.router.navigate([this.returnUrl]);
  //               },
  //               error => {
  //                   this.alertService.error(error);
  //                   this.loading = false;
  //               });
  // }

}
