import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlightSearchService } from '../services/flight-search.service';
import { NGXLogger } from 'ngx-logger';
import { ContactService } from '../services/contact.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { iif } from 'rxjs';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  contactForm: FormGroup
  template: string =
    `<img class="custom-spinner-template" src="../../assets/images/LOAD-PAGE.gif">`

  constructor(
    private formBuilder: FormBuilder,
    private registerService: FlightSearchService,
    private logger: NGXLogger,
    private contactService: ContactService,
    private spinnerService: Ng4LoadingSpinnerService,
    private flashService : FlashMessagesService
  ) {
    this.contactForm = this.formBuilder.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required]],
      register: [false]
    })
  }

  ngOnInit() {
  }

  get f() { return this.contactForm.controls }

  onSubmit() {

    this.logger.debug("send Contact submitted")
    if (this.f.email.valid) {
      if (this.f.register.value) {
        this.registerService.registerMail(this.f.email.value).subscribe((result: any) => {
          this.logger.debug("Login register mail result : " + JSON.stringify(result, null, 2))
        })
      }

      this.spinnerService.show()
      this.contactService.postMessage(this.f.firstname.value, this.f.lastname.value, this.f.email.value, this.f.message.value).subscribe((result: any) => {
        this.logger.debug("Contact email send result : " + JSON.stringify(result, null, 2))
        this.spinnerService.hide()
        if(result.success){
          this.flashService.show("Message Sent",{ cssClass: 'alert-success', timeout: 5000 })
        }else{
          this.flashService.show("Message Sent",{ cssClass: 'alert-danger', timeout: 5000 })
        }
      })
    }
  }
}
