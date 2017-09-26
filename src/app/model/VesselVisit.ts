
import { Crane } from './Crane';
import { IVesselVisit } from './IVesselVisit';


export class VesselVisit{
    constructor() {
        
        this.craneList = new Array<Crane>();
        this.idVisit = '';
        this.vesselName = '';
    }

    idVisit: string;
    vesselName: string;
    craneList: Crane[];
    startDate: Date;
    endDate: Date;

    getStartDate(): Date { 
        if (this.startDate == null) 
        {
            this.setDates();
        }
        return new Date(this.startDate);
    }

    getEndDate(): Date { 
   
        if(this.endDate == null) 
        {
            this.setDates();
        }
        return this.endDate;
    }

    setDates()
    {
        let dateList: Date[] = new Array<Date>();
        this.craneList.forEach(cr => {
            cr.unitPlannedList.forEach(u => {
                dateList.push(new Date(u.dateOfMove));
            });
        });
        this.startDate = new Date(Math.min.apply(null, dateList));
        this.endDate = new Date(Math.max.apply(null, dateList));
    }
}
