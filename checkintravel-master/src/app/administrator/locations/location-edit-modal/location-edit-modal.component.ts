import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder,Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NGXLogger } from 'ngx-logger';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { LocationsService } from 'src/app/services/locations.service';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-location-edit-modal',
  templateUrl: './location-edit-modal.component.html',
  styleUrls: ['./location-edit-modal.component.scss']
})
export class LocationEditModalComponent implements OnInit {

  @Input() location: any;
  
  submitted: Boolean = false

  editForm: FormGroup

  constructor(
    public activeModal: NgbActiveModal,
    private logger: NGXLogger,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private locationService: LocationsService,
    private flashMessage: FlashMessagesService,  
  ) { }

  ngOnInit() {    

    if (this.location && !this.isEmpty(this.location)) {
      this.editForm = this.formBuilder.group({        
        countryHeb : [this.location.country.hebrewName,[Validators.required]],
        countryEng :[this.location.country.englishName,[Validators.required]],
        airportHeb:[this.location.airport.hebrewName],
        airportEng : [this.location.airport.englishName,[Validators.required]],
        terminal : [this.location.terminal],
      })      
    } else {
      this.editForm = this.formBuilder.group({
        countryHeb : ['',[Validators.required]],
        countryEng :['',[Validators.required]],
        airportHeb:[''],
        airportEng : ['',[Validators.required]],
        terminal : [''],
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
      this.logger.debug("Update current vlaues : " + JSON.stringify(this.editForm.value, null, 2))
      this.flashMessage.show("Please fix a field", { cssClass: 'alert-danger', timeout: 5000 })
      return;
    }

    this.spinnerService.show();
    this.logger.debug("Update : values : " + JSON.stringify(this.editForm.value))
    this.locationService.updateLocation(this.location && !this.isEmpty(this.location) ? this.location._id : null, this.editForm.value).subscribe((result: any) => {
      this.spinnerService.hide();
      if (!result.success) {
        this.logger.error("Location update error : " + JSON.stringify(result))
      }
      else {
        this.logger.debug("Update OK")
        this.activeModal.close("Update OK")
      }

      this.activeModal.close('Location Updated')
    })
  }

  // convenience getter for easy access to form fields
  get f() { return this.editForm.controls; }

}
