import { Component, OnInit, Input } from '@angular/core';
import { FlightCombination } from '../services/flight-combinations.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-flight-sale',
  templateUrl: './flight-sale.component.html',
  styleUrls: ['./flight-sale.component.scss']
})
export class FlightSaleComponent implements OnInit {

  @Input() flightSale : FlightCombination
  saleImage : string
  hasReturn : boolean = false

  constructor() { }

  ngOnInit() {
    this.saleImage = "../../assets/images/SIMBOLE-BLUE.png"
    if(!_.isNil(this.flightSale.return)){
      this.hasReturn = true
    }
  }

  onMouseOver(){
    this.saleImage = "../../assets/images/SIMBOLE-GOLD.png"
  }

  onMouseOut(){
    this.saleImage = "../../assets/images/SIMBOLE-BLUE.png"
  }

  getNightCount(start,end){
    let s = moment(start);
    let e = moment(end);
    return e.diff(s,'days');
  }
}
