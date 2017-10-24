import { CraneBreak } from './CraneBreak';
import { Unit } from '../model/Unit';
export class Crane {



   constructor()
{
    //this.idCrane = idcrane;
    
}

  public idCrane: string
  public unitExecutedList: Unit[] = [];
  public unitPlannedList: Unit[] = [];
  public craneBreakList: CraneBreak[] = [];
  }
