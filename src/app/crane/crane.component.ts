import { VesselToCraneService } from './../shared/services/VesselToCraneService.service';
import { BackEndService } from './../shared/services/backEnd.service';
import { Unit } from './../model/Unit';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Crane } from '../model/Crane';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-crane',
  templateUrl: './crane.component.html',
  styleUrls: ['./crane.component.css']
})
export class CraneComponent implements OnInit, OnDestroy  {

  @Input() startCrane: boolean;
  @Input() crane: Crane;
  interval;
  currentSimDate: Date;
  totalUnits: number;
  initDelaySeconds: number;
  private subscription: Subscription;
  @ViewChild('intervalSpeed') inpSimSpeed: ElementRef;
  @ViewChild('initDelay') inpInitDelay: ElementRef;
  constructor(private backEndService: BackEndService, private vesselToCraneService: VesselToCraneService) {
  }

  ngOnInit() {
    this.vesselToCraneService.notifyObservable$.subscribe(data =>{
      this.currentSimDate = data.dateStartSim; 
      this.SimChanged(data.startSim);
    });
    this.totalUnits = this.crane.unitPlannedList.length;
    this.sortByDate();
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    if (this.subscription != null)
    {
      this.subscription.unsubscribe();
    }
  }

  SimChanged(start: boolean)
  {
    if (start) {this.OnStartSim();}
    else {this.OnStopSim();
    }
  }

  OnStartSim() {
    console.log(this.crane.idCrane +', stating simulation');
    this.initDelaySeconds = this.inpInitDelay.nativeElement.value * 60 * 1000;
    this.SetSimDate();
     
    this.interval = setInterval(() => {
      this.Sim();
    }, 1000 / this.inpSimSpeed.nativeElement.value);
  }


  OnStopSim() {
    console.log(this.crane.idCrane + ', stopping simulation');
    clearInterval(this.interval);
    this.currentSimDate = null;
  }

  SetSimDate(): void{
    let cont: number=0;
    for(let uPlanned of this.crane.unitPlannedList){
      uPlanned.dateOfMoveSIM = new Date(new Date(uPlanned.dateOfMove).getTime() + randomSeconds() + (this.initDelaySeconds));
      cont++;
    }
    console.log(cont + 'dateSIM updated!');
  }

  Sim() {
    if(this.crane.unitPlannedList.length === 0)
    {
      console.log('Crane : ' +this.crane.idCrane + ' not simulating' );
      return;
    }
    
    //if (this.currentSimDate == null) {
      //this.currentSimDate = this.vesselToCraneService.getMinDate();
    //}
    //else {
      console.log('Crane current date: ' +this.currentSimDate );
      this.currentSimDate = new Date(this.currentSimDate.getTime() + (1000 * this.inpSimSpeed.nativeElement.value));
    //}


    for (let uPlanned of this.crane.unitPlannedList) {
      if (new Date(uPlanned.dateOfMoveSIM) < new Date(this.currentSimDate)) {
        console.log('>>> Unit: ' + uPlanned.idUnit + 'sent! >>>');
        //console.log('CurrentSimDate: ' +this.currentSimDate );
        console.log('Unit date: ' + dateToYMD(new Date(uPlanned.dateOfMove)));
        console.log('Unit data (SIM): ' +dateToYMD(new Date(uPlanned.dateOfMoveSIM)));
        this.sendUnit(uPlanned.idUnit, uPlanned.dateOfMoveSIM).subscribe(data => console.log(data));
        this.crane.unitExecutedList.push(uPlanned);
        this.crane.unitPlannedList.splice(this.crane.unitPlannedList.indexOf(uPlanned), 1);
      }
    }
  }

  sendUnit(unitId: string, dateOfMoveSIM: Date) {
    return this.backEndService.sendUnit(unitId, dateOfMoveSIM);
  }


  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
}


public sortByDate(): void {
  console.log('sorting unitplanned');
    this.crane.unitPlannedList.sort((a: Unit, b: Unit) => {
        return this.getTime(new Date(a.dateOfMove)) - this.getTime(new Date(b.dateOfMove));
    });
}


}

function randomSeconds(){
  return 1000 * (Math.floor(Math.random() * 500));
}

function dateToYMD(date: Date) {
  // yyyy-MM-dd'T'HH:mm:ss
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  let H = date.getHours();
  let min = date.getMinutes();
  let secs = date.getSeconds();
  return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + 'T' + H + ':' + min + ':' + secs;
}


