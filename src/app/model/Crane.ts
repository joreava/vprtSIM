import { Unit } from '../model/Unit';
export class Crane {

   constructor(idcrane: string)
{
    this.idCrane = idcrane;
}

  public idCrane: string
  public unitExecutedList: Unit[] = [];
  public unitPlannedList: Unit[] = [];
  }
