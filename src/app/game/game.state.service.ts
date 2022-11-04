import { EventEmitter, Injectable } from '@angular/core';
import { game } from './model';
import { Wall } from './wall';
import { Unit } from './unit';
import { BehaviorSubject, map, merge, of } from 'rxjs';

export enum ColumnTitle {
  a = 'A',
  b = 'B',
  c = 'C',
  d = 'D',
  e = 'E'
}

const columnTitles = [
  'A',
  'B',
  'C',
  'D',
  'E'];

@Injectable({
  providedIn: 'root'
})
export class GameStateService {

  public readonly acceptableDirections$ = new BehaviorSubject<game.Coordinates[]>([]);
  public readonly change = new EventEmitter<void>();
  public readonly matrix$ = merge(this.change, of(null)).pipe(
    map(() => {
      if (!this.matrix) {
        this.initGenerateMatrix();
      }
      console.log(this.matrix);
      return this.matrix;
    })
  );
  private matrix: Map<number, (game.Unit | game.Wall | null)[]> | undefined;
  private readonly colors = ['red', 'green', 'yellow'];
  public readonly colorMap = new Map<string, number>(this.colors.map(color => [color, 5]));

  constructor() {
  }

  public step(unit: game.Unit): void {

  }

  public initGenerateMatrix(): void {
    this.matrix = new Map<number, Array<game.Unit | game.Wall | null>>();
    Array(5).fill(null).forEach((e, x) => {
      this.matrix!.set(x, Array(5).fill(null).map((e, y) => y % 2 === 0 && x % 2 !== 0
          ? new Wall({ corY: y, corX: x, color: 'black' })
          : y % 2 !== 0 && x % 2 !== 0
            ? null
            : new Unit({ corY: y, corX: x, color: this.getRandomCol() })
        )
      );
    });
    console.log(this.matrix);
  }

  public moveUnit(unit: Unit): void {
    console.log(unit);
    const { corX, corY } = unit;
    const matrix = this.matrix!;
    const acceptableDirections: game.Coordinates[] = [];
    if (corX > 0 && !(matrix.get(corX - 1)![corY] instanceof Wall) && matrix.get(corX - 1)![corY] === null) {
      acceptableDirections.push({ corX: corX - 1, corY });
      // matrix.get(corX - 1)![corY] = new Unit({ corY: unit.corY, corX: unit.corX - 1, color: unit.color });
      // matrix.get(corX)![corY] = null;
      // this.change.next();
      console.log('left');
    }
    if (corX < matrix.size - 1 && !(matrix.get(corX + 1)![corY] instanceof Wall) &&
      matrix.get(corX + 1)![corY] === null) {
      acceptableDirections.push({ corX: corX + 1, corY });
      // matrix.get(corX + 1)![corY] = new Unit({ corY: unit.corY, corX: unit.corX + 1, color: unit.color });
      // matrix.get(corX)![corY] = null;
      // this.change.next();
      console.log('right');
    }
    if (corY > 0 && !(matrix.get(corX)![corY - 1] instanceof Wall) && matrix.get(corX)![corY - 1] === null) {
      acceptableDirections.push({ corX, corY: corY - 1 });
      // matrix.get(corX)![corY - 1] = new Unit({ corY: unit.corY - 1, corX: unit.corX, color: unit.color });
      // matrix.get(corX)![corY] = null;
      // this.change.next();
      console.log('top');
    }
    if (corY < matrix.size - 1 && !(matrix.get(corX)![corY + 1] instanceof Wall) &&
      matrix.get(corX)![corY + 1] === null) {
      acceptableDirections.push({ corX, corY: corY + 1 });
      // matrix.get(corX)![corY + 1] = new Unit({ corY: unit.corY + 1, corX: unit.corX, color: unit.color });
      // matrix.get(corX)![corY] = null;
      console.log('bottom');
    }
    if (acceptableDirections.length) {
      if (acceptableDirections.length === 1) {
        const {corX, corY} = acceptableDirections[0];
        matrix.get(corX)![corY] = new Unit({ corY, corX, color: unit.color });
        matrix.get(unit.corX)![unit.corY] = null;
        this.change.next();
      }
    }
  }

  private getRandomCol(): string {
    let color: string | undefined = undefined;
    while (!color && [...this.colorMap.values()].some(e => e)) {
      const key = this.colors[Math.floor(Math.random() * this.colors.length)];
      const num = this.colorMap.get(key);
      if (num) {
        color = key;
        this.colorMap.set(key, num - 1);
      }
    }
    return color!;
  }

}
