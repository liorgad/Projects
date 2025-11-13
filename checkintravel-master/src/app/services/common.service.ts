import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  public config: any = {}

  constructor() {
    this.config.CONFIG_URL = environment.production ? "" : "http://localhost:8080"
  }

  GLOBAL(val) {
    return this.config[val]
  }
}
