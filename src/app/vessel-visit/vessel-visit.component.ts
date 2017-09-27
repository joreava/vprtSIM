import { VesselToCraneService } from './../shared/services/VesselToCraneService.service';
import { Observable } from 'rxjs/Rx';
import { CraneComponent } from './../crane/crane.component';
import { Unit } from './../model/Unit';
import { Crane } from './../model/Crane';
import { VesselVisit } from './../model/VesselVisit';
import { BackEndService } from './../shared/services/backEnd.service';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { parseString } from 'xml2js';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-vessel-visit',
  templateUrl: './vessel-visit.component.html',
  styleUrls: ['./vessel-visit.component.css'],
  providers: [BackEndService, VesselToCraneService],
})
export class VesselVisitComponent implements OnInit {

  vesselVisit: VesselVisit = new VesselVisit();
  simStarted: boolean;
  @ViewChild('intervalSpeed') inpSimSpeed: ElementRef;
 dateSim: Date;
  interval;
  simSpeed: number;
  busy: Subscription;
  loading: boolean;
  constructor(private backEndService: BackEndService, private vesselToCraneService: VesselToCraneService) {


  }

  ngOnInit(): void {
    this.simSpeed =  this.inpSimSpeed.nativeElement.value !== '' ?
    this.inpSimSpeed.nativeElement.value : 
    this.inpSimSpeed.nativeElement.placeholder;
    this.getVesselVisitFromN4();
    
  
  }

  ngOnDestroy(){
  clearInterval(this.interval);
}

  getVesselVisitFromN4(): void {
    console.log('>> getVesselVisitFromN4');
    this.loading = true;
    this.busy = this.backEndService.getVeselVisitN4().subscribe(data => {
      this.vesselVisit = this.VesselVisitoFromJSON(data);
      this.loading = false;
      this.dateSim = this.vesselVisit.getStartDate();
    });
  }

  VesselVisitoFromJSON(json: VesselVisit): VesselVisit {
            var result = new VesselVisit();
            for (var key in json) {
                if(result.hasOwnProperty(key)) {
                    result[key] = json[key]
                }
            }
            return result;
        }
  OnGetVesselVisit() {
    console.log('User>> GetVesselVisit');
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

      this.interval = setInterval(() => {
        this.Sim();
      }, 1000 / this.simSpeed);
    }
  }

Sim()
{
if (this.dateSim == null)
{
  this.dateSim = new Date(this.vesselVisit.getStartDate());
}
else{
  this.dateSim = new Date(this.dateSim.getTime() + (1000 * this.simSpeed));
}

  this.vesselToCraneService.notifyOther({ 
    startSim: this.simStarted, 
    dateStartSim: this.dateSim});
}

  OnStopSimulator(): void {
    if (this.simStarted) {
      this.backEndService.stopSimulator().subscribe(data => console.log(data));
      this.simStarted = false;
      this.vesselToCraneService.notifyOther(this.simStarted);
      clearInterval(this.interval);
    }
  }

  craneSimStarted(status: boolean) {
    this.simStarted = status;
  }

  OnSimXvelaVesselReady(): void {
    let xmlstring;
    this.loading = true;
    this.busy =this.backEndService.getXvelaVesselReadySim().subscribe(data => {
      xmlstring = data.text();
      console.log('xml loaded');
      this.busy =this.backEndService.sendXvelaFile(xmlstring).subscribe(res => {
        console.log('xml sent')
        this.busy = this.backEndService.getVeselVisitN4().subscribe(res => {
          console.log('vessel visit got');
          this.vesselVisit = this.VesselVisitoFromJSON(res);
          this.loading = false;
        })
      });
    }
    );
  }
}