import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class VesselToCraneService {

    private notify = new Subject<any>();
    /**
     * Observable string streams
     */
    notifyObservable$ = this.notify.asObservable();
  
    constructor(){}
  
    public notifyOther(data: any) {
        this.notify.next(data);
    }


}