import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-flight-order',
  templateUrl: './flight-order.component.html',
  styleUrls: ['./flight-order.component.scss']
})
export class FlightOrderComponent implements OnInit {
  
  template: string =
  `<img class="custom-spinner-template" src="../../assets/images/LOAD-PAGE.gif">`

  constructor() { }

  ngOnInit() {
  }

}
