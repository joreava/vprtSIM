import { BackEndService } from './../shared/services/backEnd.service';
import { Unit } from './../model/Unit';
import { Component, OnInit, Input, ViewChild, ElementRef} from '@angular/core';
import { Crane } from '../model/Crane';

@Component({
  selector: 'app-crane',
  templateUrl: './crane.component.html',
  styleUrls: ['./crane.component.css'],
  providers: [BackEndService]
})
export class CraneComponent implements OnInit {

@Input() crane: Crane;
interval;

currentSimDate : Date;
totalUnits: number;
@ViewChild('intervalSpeed') inpSimSpeed: ElementRef; 
  constructor(private backEndService: BackEndService) {
  }

  ngOnInit() {
    this.totalUnits = this.crane.unitPlannedList.length;
  }

  OnStartSim() {
      this.interval = setInterval(() => {
        this.Sim(this.inpSimSpeed.nativeElement.value);
        }, 1000 / this.inpSimSpeed.nativeElement.value)
      }

      OnStopSim() {
    clearInterval(this.interval);
    this.currentSimDate = null;
    } 

  Sim(speedSeconds: number){
    if (this.currentSimDate == null && this.crane.unitPlannedList.length > 0)
    {
      this.currentSimDate = new Date(this.crane.unitPlannedList[0].dateOfMove);
    }
    else
    {
      this.currentSimDate = new Date(this.currentSimDate.getTime() + (1000 * speedSeconds));
    }
    for (let uPlanned of this.crane.unitPlannedList)
    {
      if(new Date(uPlanned.dateOfMove) < new Date(this.currentSimDate))
      {
        console.log('>>> Unit: ' + uPlanned.idUnit + 'sent! >>>');
        this.sendUnit(uPlanned.idUnit).subscribe(data => console.log(data));
        this.crane.unitExecutedList.push(uPlanned);
        this.crane.unitPlannedList.splice(this.crane.unitPlannedList.indexOf(uPlanned), 1);
      }
    }
}

sendUnit(unitId: string)
{
  return this.backEndService.sendUnit(unitId);
}

}
