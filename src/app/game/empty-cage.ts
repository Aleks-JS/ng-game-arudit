import { game } from './model';

export class EmptyCage implements game.Coordinates {
  corX!: number;
  corY!: number;
  color = 'empty';

  constructor(args: game.Coordinates) {
    Object.assign(this, args);
  }
}
