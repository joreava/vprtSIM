import { VesselToCraneService } from './../shared/services/VesselToCraneService.service';
import { Observable } from 'rxjs/Rx';
import { CraneComponent } from './../crane/crane.component';
import { Unit } from './../model/Unit';
import { Crane } from './../model/Crane';
import { VesselVisit } from './../model/VesselVisit';
import { BackEndService } from './../shared/services/backEnd.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { parseString } from 'xml2js';

@Component({
  selector: 'app-vessel-visit',
  templateUrl: './vessel-visit.component.html',
  styleUrls: ['./vessel-visit.component.css'],
  providers: [BackEndService, VesselToCraneService]
})
export class VesselVisitComponent implements OnInit {

  vesselVisit: VesselVisit = new VesselVisit();
  simStarted: boolean;
  currentSimDate: Date;

  constructor(private backEndService: BackEndService, private vesselToCraneService: VesselToCraneService) {
  }

  ngOnInit(): void {
    this.getVesselVisitFromN4();
  }

  getVesselVisitFromN4(): void {
    console.log('>> getVesselVisitFromN4');
    this.backEndService.getVeselVisitN4().subscribe(data => {
      alert(data)
      this.vesselVisit = data;
      console.log('<< data received, min date: '+ String(this.vesselVisit.getStartDate()));
     
    });
  }

  OnGetVesselVisit() {
    console.log('User>> GetVesselVisit')
    this.getVesselVisitFromN4();
  }

  OnClearVeselVissit(): void {
    this.backEndService.clearVesselVisit().subscribe(data => 
      {
        /*console.log('vessel visit cleared')
        for (const prop of Object.getOwnPropertyNames(this.vesselVisit)) {
          delete this.vesselVisit[prop];*/
          //this.getVesselVisitFromN4();
        //}
      });
  }

  OnStartSimulator(): void {
    if (!this.simStarted) {
      this.backEndService.startSimulator().subscribe(data => console.log(data));
      this.simStarted = true;
      this.vesselToCraneService.notifyOther({ startSim: this.simStarted, dateStartSim: this.vesselVisit.getStartDate() });
    }
  }
  OnStopSimulator(): void {
    if (this.simStarted) {
      this.backEndService.stopSimulator().subscribe(data => console.log(data));
      this.simStarted = false;
      this.vesselToCraneService.notifyOther(this.simStarted);
    }
  }

  craneSimStarted(status: boolean) {
    this.simStarted = status;
  }


  OnSimXvelaVesselReady(): void {
    let xmlstring;
    this.backEndService.getXvelaVesselReadySim().subscribe(data => {

      xmlstring = data.text();
      console.log('xml loaded');
      //console.log('sending-> '+xmlstring)
      this.backEndService.sendXvelaFile(xmlstring).subscribe(res => {
        console.log('xml sent')
        this.backEndService.getVeselVisitN4().subscribe(res => {
          console.log('vessel visit got')
          this.vesselVisit = res;
        })
      });
    }
    );

  }

}