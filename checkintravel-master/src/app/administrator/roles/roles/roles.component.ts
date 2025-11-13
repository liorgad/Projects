import { Component, OnInit } from '@angular/core';
import {RolesService, Role} from '../../../services/roles.service'

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  roles : Role[]

  constructor(private rolesService : RolesService) { }

  ngOnInit() {
    this.rolesService.getRoles().subscribe((res : any)=> {      
      this.roles = res.data as Role[]
      console.log(JSON.stringify(this.roles));
    })
  }

}
