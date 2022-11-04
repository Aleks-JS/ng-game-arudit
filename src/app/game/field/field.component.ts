import { Component } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { GameStateService } from '../game.state.service';
import { Unit } from '../unit';
import { EmptyCage } from '../empty-cage';
import { Wall } from '../wall';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent {

  public isFinishGame$: Observable<boolean> = this.service.isFinish$;

  public matrix$: Observable<(Unit | Wall | EmptyCage)[][]> = this.service.matrix$.pipe(
    filter(Boolean),
    map(m => [...m.values()])
  );

  constructor(
    private service: GameStateService
  ) {
  }

  public checkIsUnit(item: Unit | Wall | EmptyCage): boolean {
    return item instanceof Unit;
  }

  public move(item: Unit | Wall | EmptyCage) {
    if (item instanceof Unit) {
      this.service.moveUnit(item)

    }
  }

  public start(): void {
    this.service.isFinish$.next(false);
  }
}
