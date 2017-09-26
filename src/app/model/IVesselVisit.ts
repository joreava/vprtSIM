import { Crane } from './Crane';
export interface IVesselVisit {
    idVisit: string;
    vesselName: string;
    craneList: Crane[];
    startDate: Date;
    endDate: Date;
}