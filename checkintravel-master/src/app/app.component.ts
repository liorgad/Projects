import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'checkintravel';

  template: string =
  `<img class="custom-spinner-template" src="../../assets/images/LOAD-PAGE.gif">`

  
}
