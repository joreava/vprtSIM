import { VesselToCraneService } from './../shared/services/VesselToCraneService.service';
import { Observable } from 'rxjs/Rx';
import { CraneComponent } from './../crane/crane.component';
import { Unit } from './../model/Unit';
import { Crane } from './../model/Crane';
import { VesselVisit } from './../model/VesselVisit';
import { BackEndService } from './../shared/services/backEnd.service';
import { Component, OnInit, Input, EventEmitter, Output, ViewChild, ViewChildren, ElementRef, QueryList, OnDestroy } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { parseString } from 'xml2js';
import { Subscription } from 'rxjs/Subscription';
import { SmartParameter } from './../model/SmartParameter';
import { StompService } from 'ng2-stomp-service';
import { Parser } from 'xml2js';
import { MessengerService } from '../shared/services/messenger.service';

@Component({
  selector: 'app-vessel-visit',
  templateUrl: './vessel-visit.component.html',
  styleUrls: ['./vessel-visit.component.css'],
  providers: [BackEndService, VesselToCraneService, StompService],
})
export class VesselVisitComponent implements OnInit, OnDestroy {
  message: any;
  subscription: Subscription
  subscriptionSocket: Subscription
  vesselVisit: VesselVisit = new VesselVisit();
  simStarted: boolean;
  @ViewChild('intervalSpeed') inpSimSpeed: ElementRef;
  dateSim: Date;
  interval;
  simSpeed: number;
  busyXVSim: Subscription;
  loading: boolean;
  smartParameterList = new Array<SmartParameter>();
  @ViewChildren('craneCmp') craneComponents: QueryList<CraneComponent>;
  //private subscription: any;
  //socket = io('http://35.176.150.177:8080/vprt-0.0.1-SNAPSHOT/pspo-ws');
  constructor(private backEndService: BackEndService,
    private vesselToCraneService: VesselToCraneService,
    private stomp: StompService,
    private messenger: MessengerService) {
    this.subscription = this.messenger.getMessage()
      .subscribe(message => this.processMessage(message));

    
    //configuration
    stomp.configure({
      host: 'http://35.176.150.177:8080/vprt-0.0.1-SNAPSHOT/vprtSIMsckt',
      debug: true,
      queue: {'init': false}
    });
  
   //start connection
    stomp.startConnect().then(() => {
    stomp.done('init');
    console.log('connected');
    
    //subscribe
    this.subscriptionSocket = stomp.subscribe('/topic/vprtSIM', this.response);
    
    //send data
    //stomp.send('destionation',{"data":"data"});
  
  });
  

  }
  ngOnInit(): void {
    console.log('connecting to socket');
    this.loading = true;
    this.getVesselVisitFromN4();
  }

  processMessage(incommingMessage: any)
  {
    let cr: Crane = <Crane> incommingMessage;
    console.log('New crane received!');
    this.vesselVisit.craneList.push(cr);
    console.log('Crane added: ' + cr.idCrane);
    let vVisit : VesselVisit = new VesselVisit();
    vVisit.craneList.push(cr);
    this.backEndService.postNewCrane(vVisit).subscribe(data => 
      console.log('postNewCrane response: ' + data));
  }

  //response
  public response = (data) => {
    console.log('Stomp response: ');
    console.log('Updating vessel visit');
    this.vesselVisit = this.VesselVisitoFromJSON(data);
    console.log(' vessel visit updated!');
  }

  ngOnDestroy() {
    console.log( 'Destroy' )
    clearInterval(this.interval);
    this.subscription.unsubscribe();
    this.subscriptionSocket.unsubscribe();
    //disconnect
    this.stomp.disconnect().then(() => {
      console.log( 'Connection closed' );
    })

  }

  getVesselVisitFromN4(): void {
    this.backEndService.getVeselVisitN4().subscribe(data => {
      this.vesselVisit = this.VesselVisitoFromJSON(data);
      this.dateSim = this.vesselVisit.getStartDate();
      this.loading = false;
    });
  }

  VesselVisitoFromJSON(json: VesselVisit): VesselVisit {
    let result = new VesselVisit();
    for (let key in json) {
      if (result.hasOwnProperty(key)) {
        result[key] = json[key]
      }
    }
    return result;
  }
  OnStartSimulator(): void {
    if (!this.loading) {
      this.simSpeed = this.inpSimSpeed.nativeElement.value !== '' ?
        this.inpSimSpeed.nativeElement.value :
        this.inpSimSpeed.nativeElement.placeholder;
      this.getCraneParameters();
      this.backEndService.startSimulator(this.smartParameterList).subscribe(data => console.log(data));
      this.simStarted = true;

      this.interval = setInterval(() => {
        this.Sim();
      }, 1000 / this.simSpeed);
    }
  }
  getCraneParameters() {
    this.craneComponents.forEach(cr => {
      let sp = cr.getSmartParameter();
      if (this.smartParameterList == null) {
        this.smartParameterList = new Array<SmartParameter>();
      }
      this.smartParameterList.push(sp);
    });
  }

  Sim() {
    if (this.dateSim == null) {
      this.dateSim = new Date(this.vesselVisit.getStartDate());
    } else {
      this.dateSim = new Date(this.dateSim.getTime() + (1000 * this.simSpeed));
    }
    this.vesselToCraneService.notifyOther({
      startSim: this.simStarted,
      dateStartSim: this.dateSim,
    });
    this.anyRemainingUnit();
  }
 

  
  OnStopSimulator(): void {
    if (this.simStarted) {
      this.backEndService.stopSimulator().subscribe(data => console.log(data));
      this.stopSim();
    }
  }

  stopSim() {
    this.simStarted = false;
    this.smartParameterList = null;
    this.vesselToCraneService.notifyOther(this.simStarted);
    clearInterval(this.interval);
  }
  craneSimStarted(status: boolean) {
    this.simStarted = status;
  }

  anyRemainingUnit() {
    let acum = 0;
    this.vesselVisit.craneList.forEach(cr => {
      acum = acum + cr.unitPlannedList.length;
    })

    if (acum === 0) {
      console.log('Simulation finished!');
      this.OnStopSimulator();
    }
  }
  OnSimXvelaVesselReady(): void {
   
    //if (!this.loading) {
      alert('aa')
      this.loading = true;
      console.log('OnSimXvelaVesselReady STARTED!');
      //this.vesselVisit = null;
      this.stopSim();
      this.busyXVSim = Observable.forkJoin(
        this.backEndService.stopSimulator(),
        this.backEndService.getXvelaVesselReadySim()
      ).subscribe(res => {
        this.vesselVisit = this.VesselVisitoFromJSON(res[1]);
        this.dateSim = this.vesselVisit.getStartDate();
        console.log('OnSimXvelaVesselReady FINISHED');
        console.log(res[1]);
        this.loading = false;
      });
    //}
  }
}