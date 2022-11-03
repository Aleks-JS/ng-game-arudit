import { game } from './model';

export class Unit implements game.Unit {
  public color!: string;
  public corX!: number;
  public corY!: number;

  constructor(args: game.Unit) {
    Object.assign(this, args)
  }

}
