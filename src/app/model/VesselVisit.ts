
import { Crane } from './Crane';
export class VesselVisit  {
    constructor() {

        this.craneList = new Array<Crane>();
        this.idVisit = '';
        this.vesselName = '';
    }
    idVisit: string;
    vesselName: string;
    craneList: Crane[];
}
