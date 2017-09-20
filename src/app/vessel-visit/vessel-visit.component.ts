import { Observable } from 'rxjs/Rx';
import { CraneComponent } from './../crane/crane.component';
import { Unit } from './../model/Unit';
import { Crane } from './../model/Crane';
import { VesselVisit } from './../model/VesselVisit';
import { BackEndService } from './../shared/services/backEnd.service';
import { Component, OnInit, Input } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

@Component({
  selector: 'app-vessel-visit',
  templateUrl: './vessel-visit.component.html',
  styleUrls: ['./vessel-visit.component.css'],
  providers: [BackEndService]
})
export class VesselVisitComponent implements OnInit {

/*craneList: CraneComponent[] = [];
vesselName: string;
vesVis: string;
list: string[] = [];*/

vTestJson: string;
cr1: Crane = new Crane('QC11');
cr2: Crane = new Crane('QC33');

 u1: Unit = new Unit('TCNU2968547');
 u2: Unit = new Unit('MSCU2587496');
 u3: Unit = new Unit('KKFU7895521');
 u4: Unit = new Unit('TCLU9968570');
 u5: Unit = new Unit('MSCU2587496');
 u6: Unit = new Unit('MOLU9685711');
 u7: Unit = new Unit('BOLU7889332');
 u8: Unit = new Unit('LIDU2001487');


 vesselVisit: VesselVisit = new VesselVisit();
 vesselVisitTest: VesselVisit = new VesselVisit();
 timerSubscription;
result: any;
resultTest: any;
result3: any;
result4: any;

  constructor(private backEndService: BackEndService) {
   }
   
  ngOnInit(): void {
    this.getVesselVisitFromN4();
}

getVesselVisitFromN4() : void{
  console.log('>> getVesselVisitFromN4')
  this.backEndService.getVeselVisitN4().subscribe(data => {
    this.vesselVisit = data;
    console.log('<< data received')
    console.log(data)
    this.result = JSON.stringify(data);
    //this.subscribeToData();
  });
}

private subscribeToData(): void {
  this.timerSubscription = Observable.timer(5000).first().subscribe(() => this.getVesselVisitFromN4());
}
}
