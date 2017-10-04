
import { VesselToCraneService } from './../shared/services/VesselToCraneService.service';
import { BackEndService } from './../shared/services/backEnd.service';
import { Unit } from './../model/Unit';
import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Crane } from '../model/Crane';
import { Subscription } from 'rxjs';
import { CraneBreak } from 'app/model/CraneBreak';

@Component({
  selector: 'app-crane',
  templateUrl: './crane.component.html',
  styleUrls: ['./crane.component.css']
})
export class CraneComponent implements OnInit, OnDestroy {
  @Input() startCrane: boolean;
  @Input() crane: Crane;
  currentSimDate: Date;
  totalUnits: number;
  initDelaySeconds: number;
  private subscription: Subscription;
  @ViewChild('initDelay') inpInitDelay: ElementRef;
  @ViewChild('cbStartTime') inpcbStartTime: ElementRef;
  @ViewChild('cbMinutes') inpcbMinutes: ElementRef;
  craneBreakList: CraneBreak[] = [];
  isAddCBChecked: boolean;
  constructor(private backEndService: BackEndService, private vesselToCraneService: VesselToCraneService) {
  }

  ngOnInit() {
    this.vesselToCraneService.notifyObservable$
      .subscribe(data => {
        this.currentSimDate = new Date(data.dateStartSim);
        this.SimChanged(data.startSim);
      });
    this.totalUnits = this.crane.unitPlannedList.length;
    this.sortPlanedListByDateASC();
    this.currentSimDate = new Date();
    this.isAddCBChecked = false;
  }

  ngOnDestroy() {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

  SimChanged(start: boolean) {
    if (start) { this.OnStartSim(); }
    else { this.OnStopSim(); }
  }

  OnStartSim() {
    this.SetSimDate();
    this.Sim();
  }
  OnStopSim() {
    console.log(this.crane.idCrane + ', stopping simulation');
    this.currentSimDate = null;
  }
  SetSimDate_original(): void {

    let delay = this.inpInitDelay.nativeElement.value !== '' ?
      this.inpInitDelay.nativeElement.value :
      this.inpInitDelay.nativeElement.placeholder;
    this.initDelaySeconds = delay * 60 * 1000;

    let cont: number = 0;
    for (let uPlanned of this.crane.unitPlannedList) {
      // only if dateOfMove is null
      if (!uPlanned.dateOfMoveSIM) {
        uPlanned.dateOfMoveSIM = new Date(new Date(uPlanned.dateOfMove).getTime() + randomSeconds() + (this.initDelaySeconds));
      }
    }
  }

  SetSimDate(): void {
    if (this.crane.unitPlannedList.some(u => !u.dateOfMoveSIM)) {
      let delay = this.inpInitDelay.nativeElement.value !== '' ?
        this.inpInitDelay.nativeElement.value :
        this.inpInitDelay.nativeElement.placeholder;
      this.initDelaySeconds = delay * 60 * 1000;

      for (let uPlanned of this.crane.unitPlannedList) {
        uPlanned.dateOfMoveSIM = new Date(new Date(uPlanned.dateOfMove).getTime() + randomSeconds() + (this.initDelaySeconds));
      }
      this.SetCraneBreaks();
      this.SetCraneBreaksUser();
      console.log('CraneBreakList: '+ this.craneBreakList.length);
      this.craneBreakList.forEach(cb =>
        {
          let startCb = new Date(cb.startDate);
          let endCb = new Date(cb.endDate);

          console.log(this.crane.idCrane + ' CB: T: ' + cb.type +
          ' S: '+ dateToYMD(startCb) +
          ' E: '+ dateToYMD(cb.endDate));
          
        })
      for (let uPlanned of this.crane.unitPlannedList) {
        // only if dateOfMove is null
        let durationCB = this.IsInsideCraneBreak(uPlanned.dateOfMoveSIM);
        if (durationCB > 0) {
          let previous = new Date(uPlanned.dateOfMoveSIM);
          uPlanned.dateOfMoveSIM = new Date(new Date(uPlanned.dateOfMoveSIM).getTime() + durationCB);
          let newprevious = new Date(uPlanned.dateOfMoveSIM);
          /*console.log('Duration ' + durationCB +
            ' Unit ' + uPlanned.idUnit +
            'dateSim Update; ' + dateToYMD(previous) +
            ' -> ' + dateToYMD(newprevious));*/
        }

      }
    }
  }

  SetCraneBreaks() {
    if (this.craneBreakList.length > 0) { return; }

    this.crane.unitPlannedList.forEach((uPlanned, index) => {
      if (index < this.crane.unitPlannedList.length - 1) {
        let diffSecs: number = (new Date(this.crane.unitPlannedList[index + 1].dateOfMove).getTime() -
          new Date(this.crane.unitPlannedList[index].dateOfMove).getTime())
          / 1000;

        if (diffSecs > 1800) {
          let cbreak: CraneBreak = new CraneBreak();
          cbreak.startDate = new Date(this.crane.unitPlannedList[index].dateOfMove);
          cbreak.endDate = new Date(this.crane.unitPlannedList[index + 1].dateOfMove);
          // Planned Crane Breaks
          cbreak.type = 'P';
          this.craneBreakList.push(cbreak);
          
        }
      }
    });
  }

  SetCraneBreaksUser() {

  if(!this.isAddCBChecked){
    return;
  }

    let craneBreakMinutes = this.inpcbMinutes.nativeElement.value !== '' ?
      this.inpcbMinutes.nativeElement.value :
      this.inpcbMinutes.nativeElement.placeholder;
    craneBreakMinutes = craneBreakMinutes * 60 * 1000;

    let time: string = this.inpcbStartTime.nativeElement.value !== '' ?
    this.inpcbStartTime.nativeElement.value :
    this.inpcbStartTime.nativeElement.placeholder;

    let cBreak: CraneBreak = new CraneBreak();

    const year = this.currentSimDate.getFullYear();
    const month = this.currentSimDate.getMonth();
    const day = this.currentSimDate.getDate();

    const timeSplited = time.split(':');
  
    let hours = timeSplited[0]; 
    let minutes = timeSplited[1]; 

    cBreak.startDate = new Date(year, month, day, +hours , +minutes, 0, 0);
   
    cBreak.endDate = new Date(cBreak.startDate.getTime() + craneBreakMinutes);
    cBreak.type = 'U';
    this.craneBreakList.push(cBreak);
    console.log('-----------------CraneBreak added by user: ' + dateToYMD(cBreak.startDate) + '-> ' + dateToYMD(cBreak.endDate));
  }

  IsInsideCraneBreak(date: Date): number {
    let cbo = this.craneBreakList.find(cb =>
      (new Date(date).getTime() > new Date(cb.startDate).getTime())
      &&
      (new Date(date).getTime() < new Date(cb.endDate).getTime()));
    if (!cbo) {
      return 0;
    }
    let duration = (new Date(cbo.endDate).getTime() - new Date(cbo.startDate).getTime());
    console.log(dateToYMD(new Date(date)) + 'inside CB ('+ cbo.type +')');
    return duration;

  }
  Sim() {

    this.sortPlanedListByDateASC();

    if (this.crane.unitPlannedList.length > 0) {
      for (let uPlanned of this.crane.unitPlannedList) {
        if (new Date (uPlanned.dateOfMoveSIM) < new Date(this.currentSimDate)) {
          console.log('>>> Unit: ' + uPlanned.idUnit + 'sent! >>>');
          console.log('Unit date: ' + dateToYMD(new Date(uPlanned.dateOfMove)));
          console.log('Unit dateOfMove: ' + dateToYMD(new Date(uPlanned.dateOfMoveSIM)));
          console.log('Current date: ' + dateToYMD(new Date(this.currentSimDate)));

          this.crane.unitExecutedList.push(uPlanned);
          this.crane.unitPlannedList.splice(this.crane.unitPlannedList.indexOf(uPlanned), 1);
          this.sendUnit(uPlanned.idUnit, uPlanned.dateOfMoveSIM).subscribe(data => console.log(data));
          console.log('Removing from planned list: ' + uPlanned.idUnit + '(' + this.crane.unitPlannedList.indexOf(uPlanned) + ')');
          this.sortExecutedListByDateDESC();
        }
      }
    }
  }

  sendUnit(unitId: string, dateOfMoveSIM: Date) {
    return this.backEndService.sendUnit(unitId, dateOfMoveSIM);
  }

  private getTime(date?: Date) {
    return date != null ? date.getTime() : 0;
  }

  public sortPlanedListByDateASC(): void {
    this.crane.unitPlannedList.sort((a: Unit, b: Unit) => {
      return this.getTime(new Date(a.dateOfMove)) - this.getTime(new Date(b.dateOfMove));
    });
  }
  public sortExecutedListByDateDESC(): void {
    this.crane.unitExecutedList.sort((a: Unit, b: Unit) => {
      return this.getTime(new Date(b.dateOfMove)) - this.getTime(new Date(a.dateOfMove));
    });
  }
}

function randomSeconds() {
  return 1000 * (Math.floor(Math.random() * 800));
}

function dateToYMD(date: Date) {
  // yyyy-MM-dd'T'HH:mm:ss
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  let H = date.getHours();
  let min = date.getMinutes();
  let secs = date.getSeconds();
  return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + 'T' + H + ':' + (min <= 9 ? '0' + min : min)  + ':' + (secs <= 9 ? '0' + secs : secs);
}


