import { CraneBreak } from 'app/model/CraneBreak';
import { Crane } from './../model/Crane';
import { Unit } from './../model/Unit';
import { BackEndService } from './../shared/services/backEnd.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MessengerService } from 'app/shared/services/messenger.service';

@Component({
  selector: 'app-add-crane',
  templateUrl: './add-crane.component.html',
  styleUrls: ['./add-crane.component.css']
})
export class AddCraneComponent implements OnInit {

  @ViewChild('numUnits') inpNumUnits;
  @ViewChild('startTime') inpStartTime;
  @ViewChild('avgunits') inpAvgSecs; 
  @ViewChild('craneName') inpCraneId; 
  @ViewChild('cBreakStart') inpCBreakStart; 
  @ViewChild('cBreakDuration') inpCBreakDuration; 
  constructor(private backEndService: BackEndService,
    private messenger: MessengerService) { }

  ngOnInit() {
  }



  createCrane()
  {
    let crId = this.inpCraneId.nativeElement.value !== '' ?
    this.inpCraneId.nativeElement.value :
    this.inpCraneId.nativeElement.placeholder;

    let time = this.inpCBreakStart.nativeElement.value !== '' ?
    this.inpCBreakStart.nativeElement.value :
    this.inpCBreakStart.nativeElement.placeholder;

   /* const year = this.currentSimDate.getFullYear();
    const month = this.currentSimDate.getMonth();
    const day = this.currentSimDate.getDate();
*/

const year = 2017;
const month = 9;
const day = 13;

    const timeSplited = time.split(':');
  
    let hours = timeSplited[0]; 
    let minutes = timeSplited[1]; 


    let cBreakDuration = this.inpCBreakDuration.nativeElement.value !== '' ?
    this.inpCBreakDuration.nativeElement.value :
    this.inpCBreakDuration.nativeElement.placeholder;
    

    let crane: Crane = new Crane();
    crane.idCrane = crId;
    let cBreak: CraneBreak = new CraneBreak();
    cBreak.startDate = new Date(year, month, day, +hours , +minutes, 0, 0);
    console.log('crane break starts ' + cBreak.startDate);
    cBreak.endDate = new Date(cBreak.startDate.getTime() + (1000 * 60 * cBreakDuration));
    console.log('crane break ends ' + cBreak.endDate);
    cBreak.idCrane = crId;

    crane.craneBreakList.push(cBreak);
    console.log('Crane break added to new crane ' + crId);
    crane.unitPlannedList = this.createContainers(crane);
    console.log('Adding containers to new crane ' + crId);

    console.log(JSON.stringify(crane));


    this.messenger.sendMesssage(crane);

  }



  createContainers(crane: Crane): Unit []
  {
    let numUnits = this.inpNumUnits.nativeElement.value !== '' ?
    this.inpNumUnits.nativeElement.value :
    this.inpNumUnits.nativeElement.placeholder;

    let startTime = this.inpStartTime.nativeElement.value !== '' ?
    this.inpStartTime.nativeElement.value :
    this.inpStartTime.nativeElement.placeholder;

    

   /* const year = this.currentSimDate.getFullYear();
    const month = this.currentSimDate.getMonth();
    const day = this.currentSimDate.getDate();
*/

const year = 2017;
const month = 9;
const day = 13;

    const timeSplited = startTime.split(':');
  
    let hours = timeSplited[0]; 
    let minutes = timeSplited[1]; 

    console.log('>>>>> h' + hours + 'm: ' + minutes);

    let avgSeconds = this.inpAvgSecs.nativeElement.value !== '' ?
    this.inpAvgSecs.nativeElement.value :
    this.inpAvgSecs.nativeElement.placeholder;

   
    let unitPlannedList: Unit[] = [];
    let HunitName = 'CHEMU';
    if (numUnits === 0)
    {
      console.log('number of units is less than 0');
      return null;
    }

    let stDate: Date =  new Date(year, month, day, +hours , +minutes, 0, 0);
    console.log(`creanting ${numUnits} containers`);
    for(let i = 0; i < numUnits; i++)
    {
        let newUnit: Unit = new Unit(HunitName + i.toString());
        newUnit.dateOfMove =  stDate;
        newUnit.craneId = crane.idCrane;
        stDate = new Date(stDate.getTime() + (avgSeconds * 1000));
        console.log('.....'+stDate);
        unitPlannedList.push(newUnit);
    }
    console.log(`total containers created ${unitPlannedList.length}`);
    return unitPlannedList;
  }

}
