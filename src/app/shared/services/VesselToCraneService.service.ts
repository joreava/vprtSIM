import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class VesselToCraneService {

    private notify = new Subject<boolean>();
    /**
     * Observable string streams
     */
    notifyObservable$ = this.notify.asObservable();
  
    constructor(){}
  
    public notifyOther(data: boolean) {
        this.notify.next(data);
    }

}