import { CraneBreak } from './CraneBreak';
import { Unit } from '../model/Unit';
export class Crane {

  craneBreakList: CraneBreak[] = [];

   constructor(idcrane: string)
{
    this.idCrane = idcrane;
}

  public idCrane: string
  public unitExecutedList: Unit[] = [];
  public unitPlannedList: Unit[] = [];
  }
