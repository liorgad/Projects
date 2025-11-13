import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService, User } from 'src/app/services/users.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { UserModalComponent } from '../user-modal/user-modal.component'
import { UserDeleteModalComponent } from '../user-delete-modal/user-delete-modal.component';
import { HttpResponse } from '@angular/common/http';
import { saveAs} from 'file-saver';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  users: User[]  

  constructor(
    private usersService: UsersService,
    private router: Router,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private modalService: NgbModal   ) { }

  ngOnInit() {
    this.loadUsers()
  }

  openUserModal(user) {
    this.logger.debug("open Edit Modal for : " + JSON.stringify(user))
    const modalRef = this.modalService.open(UserModalComponent);
    modalRef.componentInstance.user = user;

    modalRef.result.then((result) => {
      console.log(result);
      this.loadUsers();
    }).catch((error) => {
      console.log(error);
    });
  }

  loadUsers() {
    this.usersService.getUsers().subscribe((res: any) => {
      this.users = res.data
      this.logger.debug(JSON.stringify(this.users));
      
    })
  }

  openUserDeleteModal(user){
    this.logger.debug("open Delete Modal for : " + JSON.stringify(user))
    const modalRef = this.modalService.open(UserDeleteModalComponent);
    modalRef.componentInstance.userId = user._id;

    modalRef.result.then((result) => {
      console.log(result);
      this.loadUsers();
    }).catch((error) => {
      console.log(error);
    });
  }

  onGenerateReport(user){
    this.usersService.generateReport(user.email).subscribe((response : HttpResponse<Blob>)=>{
      this.logger.debug(response);
      let name = response.headers.get('content-disposition').split('=')[1]        
      saveAs(response.body, name)
    })
  }
  
  ngOnDestroy(): void {

  }

  addUser(){
    this.users = [...this.users,{}as User ]
  }

}
