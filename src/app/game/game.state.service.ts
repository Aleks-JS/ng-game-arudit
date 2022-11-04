import { EventEmitter, Injectable } from '@angular/core';
import { game } from './model';
import { Wall } from './wall';
import { Unit } from './unit';
import {BehaviorSubject, distinctUntilChanged, filter, map, merge, of, Subject, switchMap, takeUntil, tap} from 'rxjs';
import { EmptyCage } from './empty-cage';
import { DestroyService } from '../common/destroyService';

@Injectable({
  providedIn: 'root'
})
export class GameStateService extends DestroyService {

  private matrix!: Map<number, (Unit | Wall | EmptyCage)[]>;
  private selectedUnit: Unit | undefined;
  private readonly colors = ['red', 'green', 'yellow'];


  public readonly acceptableDirections$ = new BehaviorSubject<game.Coordinates[]>([]);
  public readonly selectedDirectionCell$ = new Subject<Unit | undefined>();
  public readonly change = new EventEmitter<void>();

  public readonly isFinish$ = new BehaviorSubject<boolean>(false);
  public readonly matrix$ = this.isFinish$.pipe(
    tap(bool => {
      if (bool) {
        this.matrix = new Map();
        this.colorMap = new Map<string, number>(this.colors.map(color => [color, 5]));
      }
    }),
    filter(o => !o),
    distinctUntilChanged(),
    switchMap(() => merge(this.change, of(null))),
    map(() => {
      console.log(this.matrix);
      if (!this.matrix || !this.matrix.size) {
        this.initGenerateMatrix();
      }
      return this.matrix;
    }),
    tap(matrix => this.isFinish$.next(![...matrix.values()].filter((m, i) => i%2 === 0).map(m => new Set(m.map(e => e.color)).size === 1).some(m => !m)))
  );
  public colorMap = new Map<string, number>(this.colors.map(color => [color, 5]));

  constructor() {
    super();
    this.selectedDirectionCell$.pipe(
      takeUntil(this)
    ).subscribe(next => {
      this.takeStep(this.matrix.get(this.selectedUnit!.corX)![this.selectedUnit!.corY],  this.matrix.get(next!.corX)![next!.corY]);
      this.acceptableDirections$.next([]);
    })
  }

  private initGenerateMatrix(): void {
    this.matrix = new Map<number, Array<Unit | Wall | EmptyCage>>();
    Array(5).fill(null).forEach((e, x) => {
      this.matrix!.set(x, Array(5).fill(null).map((e, y) => y % 2 === 0 && x % 2 !== 0
          ? new Wall({ corY: y, corX: x, color: 'black' })
          : y % 2 !== 0 && x % 2 !== 0
            ? new EmptyCage({ corY: y, corX: x})
            : new Unit({ corY: y, corX: x, color: this.getRandomCol() })
        )
      );
    });
  }

  public moveUnit(unit: Unit): void {
    this.selectedUnit = unit;
    const { corX, corY } = unit;
    const matrix = this.matrix!;
    const acceptableDirections: game.Coordinates[] = [];
    const directCor = {
      left: corX - 1,
      right: corX + 1,
      top: corY - 1,
      bottom: corY + 1
    }
    if (corX > 0 && !(matrix.get(directCor.left)![corY] instanceof Wall) && matrix.get(directCor.left)![corY] instanceof EmptyCage) {
      acceptableDirections.push({ corX: directCor.left, corY });
      console.log('left');
    }
    if (corX < matrix.size - 1 && !(matrix.get(directCor.right)![corY] instanceof Wall) &&
      matrix.get(directCor.right)![corY] instanceof EmptyCage) {
      acceptableDirections.push({ corX: directCor.right, corY });
      console.log('right');
    }
    if (corY > 0 && !(matrix.get(corX)![directCor.top] instanceof Wall) && matrix.get(corX)![directCor.top] instanceof EmptyCage) {
      acceptableDirections.push({ corX, corY: directCor.top });
      console.log('top');
    }
    if (corY < matrix.size - 1 && !(matrix.get(corX)![directCor.bottom] instanceof Wall) &&
      matrix.get(corX)![directCor.bottom] instanceof EmptyCage) {
      acceptableDirections.push({ corX, corY: directCor.bottom });
      console.log('bottom');
    }
    if (acceptableDirections.length) {
      if (acceptableDirections.length === 1) {
        const {corX, corY} = acceptableDirections[0];
        this.takeStep(matrix.get(unit.corX)![unit.corY],  matrix.get(corX)![corY]);
      } else {
        this.acceptableDirections$.next(acceptableDirections)
      }
    }
  }

  private takeStep(current: Unit, next: Unit): void {
    this.matrix.get(next.corX)![next.corY] = new Unit({ corY: next.corY, corX: next.corX, color: current.color });
    this.matrix.get(current.corX)![current.corY] = new EmptyCage({ corY: current.corY, corX: current.corX });
    this.change.next();
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
