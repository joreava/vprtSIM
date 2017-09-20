import { BackEndService } from './shared/services/backEnd.service';
import { VesselVisit } from './model/VesselVisit';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [BackEndService]
})
export class AppComponent {


evenArray : number[] = [];
oddArray : number[] = [];

constructor(private backEndService: BackEndService)
{

}

ngOnInit(): void {

}

newNumberReceived(rNumber : number){
  if(rNumber % 2 === 0)
  {
    this.evenArray.push(rNumber);
  }
  else
  {
    this.oddArray.push(rNumber);
  }

}
}
