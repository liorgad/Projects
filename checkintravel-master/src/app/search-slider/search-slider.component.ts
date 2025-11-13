import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-slider',
  templateUrl: './search-slider.component.html',
  styleUrls: ['./search-slider.component.scss']  
})
export class SearchSliderComponent implements OnInit {

  images : string[] = [
    "../../assets/images/landing-slide-images/home page.jpg",
    "../../assets/images/landing-slide-images/home page_1.jpg",
    "../../assets/images/landing-slide-images/home page_2.jpg"
  ]

  constructor() { }

  ngOnInit() {
  }

}
