import { game } from './model';

export class Wall implements game.Wall {
  public block = true;
  public color!: string;
  public corX!: number;
  public corY!: number;

  constructor(args: game.Unit) {
    Object.assign(this, args);
  }
}
