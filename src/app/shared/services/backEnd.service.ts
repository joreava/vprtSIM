import { Unit } from './../../model/Unit';
import { WebSocketService } from './WebSocketService.service';
import { VesselVisit } from './../../model/VesselVisit';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IVesselVisit } from './../../model/IVesselVisit';
import 'rxjs/add/operator/catch';
import { Subject } from 'rxjs/Subject';

const CHAT_URL = 'ws://http://35.176.150.177:8080:3005';

@Injectable()
export class BackEndService {


private baseUrl: string = 'http://localhost:61296/api';
  
private wsService: WebSocketService;
  constructor(private http: Http) {
  }

  xmlstring: string;
  vesselVis: VesselVisit;
  vesselVisitList: VesselVisit[] = [];
  public vesselVisitSubject: Subject<VesselVisit>  = new Subject<VesselVisit>();
  getAll(): Observable<any> {
    let result = this.http.get(this.baseUrl + '/values').map(data => data.json());
    return result;
  }

  getVeselVisit(): Observable<VesselVisit> {
    const result = this.http.get(this.baseUrl + '/values/GetVesselVisit/')
      .map(res => <VesselVisit>(res.json()));

    return result;
  }

  getVeselVisitTest(): Observable<IVesselVisit> {
    let result$ = this.http.get(this.baseUrl + '/values/GetVesselVisitTest/')
      .map(m => <VesselVisit>m.json());
    return result$;
  }

  getVeselVisitLocal(): Observable<IVesselVisit> {


    let result$ = this.http.get('https://my-json-server.typicode.com/joreava/webapiTest/VesselVisit')
      .map(m => <VesselVisit>m.json());
    return result$;
  }

  getVeselVisitN4(): Observable<IVesselVisit> {

    let result$ = this.http.get('http://35.176.150.177:8080/vprt-0.0.1-SNAPSHOT/VesselVisit/')
      .map(m => <VesselVisit>m.json());
    return result$;
  }


  sendUnit(unitId: string): Observable<boolean> {
    let headers = new Headers({ 'Content-Type': 'text/xml' });
    let options = new RequestOptions({ headers: headers });
    this.xmlstring = '<payload><additional-info><field id=\'visitId\' value=\'1GM1405\' /><field id=\'requestType\' value=\'UNIT_LOAD\' /><field id=\'action\' value=\'update\' /><field id=\'visitType\' value=\'VESSEL\' /><field id=\'ExecutedUnitTime\' value=\'' + dateToYMD(new Date()) + '\' /></additional-info><unit id=\'' + unitId + '\' gross-weight=\'1900.0\' iso-code=\'22G1\' length-mm=\'6068\' height-mm=\'2591\' width-mm=\'2438\' is-hazardous=\'false\' tank-rail-type=\'UNKNOWN\' incompatibility-reason=\'NONE\'><current-position loc-type=\'VESSEL\' location=\'1GM1405\' block=\'A\' row=\'61\' column=\'11\' tier=\'88\' /><flags><permission id=\'RTO_CAT_E_OR_T_NOT_LANDSIDE_OUT\' /><permission id=\'VGM_REQUIRED\' /><permission id=\'PREAN_RECEIVE_PRM\' /><permission id=\'RTO_PP\' /><permission id=\'RTO_PD\' /><permission id=\'PREAN_ DELIVER_PRM\' /><permission id=\'RTO_CB\' /><permission id=\'LINE_LOAD\' /></flags></unit></payload>';

    // tslint:disable-next-line:max-line-length
    return this.http.post('http://35.176.150.177:8080/vprt-0.0.1-SNAPSHOT/xvelaLoadDschUnit/', this.xmlstring, options) // ...using post request
      .map((res: Response) => { res.json(); console.log(res); }) // ...and calling .json() on the response to return data
      .catch((error: any) => Observable.throw(error.json().error || 'Server error')); // ...errors if any

  }


  connectToSocket()
  {
    // 1. subscribe to chatbox
		this.vesselVisitSubject   = <Subject<VesselVisit>>this.wsService
    .connect(CHAT_URL)
    .map((response: MessageEvent): VesselVisit => {
      let data = JSON.parse(response.data);
      return {
        vesselName : data.vesselName,
        idVisit: data.idVisit,
        craneList: data.craneList
      }
    });
  }

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