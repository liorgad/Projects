import { Component, OnInit, Input } from '@angular/core';
import { Airline, FlightsService } from 'src/app/services/flights.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as _ from 'lodash';

@Component({
  selector: 'app-airline-edit-modal',
  templateUrl: './airline-edit-modal.component.html',
  styleUrls: ['./airline-edit-modal.component.scss']
})
export class AirlineEditModalComponent implements OnInit {

  image : string | ArrayBuffer;
  isImageLoaded : boolean= false

  @Input() airline: any;
  @Input() airlines: Airline[]
  
  submitted: Boolean = false
  isNew : Boolean = false

  editForm: FormGroup

  constructor(
    public activeModal: NgbActiveModal,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,    
    private flashMessage: FlashMessagesService,
    private flightsService: FlightsService,    
  ) { }

  ngOnInit() {
    // this.flightsService.getAirlines().subscribe((result : any) =>{
    //   this.logger.debug("airlines result :" + JSON.stringify(result,null,2))
    //   if(result.success)
    //   {
    //     this.airlines = result.data;
    //   }      
    // })

    if (this.airline && !_.isEmpty(this.airline)) {

      this.editForm = this.formBuilder.group({
        name : [this.airline.name,[Validators.required]],
        image : ['',[Validators.required]]        
      })

    } else {
      this.isNew =true;
      this.editForm = this.formBuilder.group({        
        name : ['',[Validators.required]],
        image : ['',[Validators.required]]      
      })
    }  
  }


  changeListener($event) : void {
    this.readThis($event.target);
  }
  
  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();
  
    myReader.onloadend = (e) => {
      this.image = myReader.result;
      this.isImageLoaded = true
    }
    myReader.readAsDataURL(file);
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
    this.flightsService.updateAirline(this.airline && !_.isEmpty(this.airline) ? this.airline._id : null, {name: this.f.name.value,img: this.image}).subscribe((result: any) => {
      this.spinnerService.hide();
      if (!result.success) {
        this.logger.error("Airline update error : " + JSON.stringify(result))
      }
      else {
        this.logger.debug("Update OK")
        this.activeModal.close("Update OK")
      }

      this.activeModal.close('Airline Updated')
    })
  }

  // // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }
}
