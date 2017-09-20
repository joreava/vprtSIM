import { Unit } from '../model/Unit';
export class Crane {

   constructor(idcrane: string)
{
    this.idCrane = idcrane;
    this.unitExecutedList.push(new Unit('MSCK1234567'));
    this.unitExecutedList.push(new Unit('TCKU5633679'));
    this.unitPlannedList.push(new Unit('KKFU9784321'));
}

  public idCrane: string
  public unitExecutedList: Unit[] = [];
  public unitPlannedList: Unit[] = [];
  }
