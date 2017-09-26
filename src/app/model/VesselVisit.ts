
import { Crane } from './Crane';
export class VesselVisit {
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

        if (this.startDate === null) 
        {
            this.setDates();
        }
        return new Date(this.startDate);
    }

    getEndDate(): Date { 
   
        if(this.endDate === null) 
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
                dateList.push(u.dateOfMove);
            });
        });
        console.log('Total dates: ' + dateList.length)
        this.startDate = new Date(Math.min.apply(null, dateList));
        this.endDate = new Date(Math.max.apply(null, dateList));
    }
}
