import { Component, OnInit } from '@angular/core';
import { LocationsService } from 'src/app/services/locations.service';
import { NGXLogger } from 'ngx-logger';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationEditModalComponent } from '../location-edit-modal/location-edit-modal.component';
import { LocationDeleteModalComponent } from '../location-delete-modal/location-delete-modal.component';

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.scss']
})
export class LocationsComponent implements OnInit {

  locations: Location[]

  constructor(
    private locationsService: LocationsService,
    private logger: NGXLogger,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.loadLocations()
  }

  openLocationEditModal(location){
    this.logger.debug("open Edit Modal for : " + JSON.stringify(location))
    
    const modalRef = this.modalService.open(LocationEditModalComponent);  

    modalRef.componentInstance.location = this.isEmptyObject(location) ? undefined : location;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadLocations();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  openLocationDeleteModal(location){
    this.logger.debug("open Delete Modal for : " + JSON.stringify(location))
    const modalRef = this.modalService.open(LocationDeleteModalComponent);
    modalRef.componentInstance.id = location._id;

    modalRef.result.then((result) => {
      this.logger.debug(result);
      this.loadLocations();
    }).catch((error) => {
      this.logger.error(error);
    });
  }

  addElement(){
    this.locations = [...this.locations,{}as Location ]
  }

  loadLocations(){
    this.locationsService.getLocations()
    .subscribe((result:any )=> {
      this.logger.debug('LoadLocations result : ' + JSON.stringify(result,null,2));
      this.locations = result.data      
    })
  }

  isEmptyObject(obj){
    return (Object.getOwnPropertyNames(obj).length === 0);
  }
}
