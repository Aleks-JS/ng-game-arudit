import { Component, OnInit } from '@angular/core';
import { filter, map, Observable } from 'rxjs';
import { GameStateService } from '../game.state.service';
import { game } from '../model';
import { Unit } from '../unit';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.css']
})
export class FieldComponent implements OnInit {


  public matrix$: Observable<(game.Unit | game.Wall | null)[][]> = this.service.matrix$.pipe(
    filter(Boolean),
    map(m => {
      return [...m.values()];
    })
  );

  constructor(
    private service: GameStateService
  ) {
  }

  ngOnInit(): void {
  }

  public checkIsUnit(item: game.Unit | game.Wall | null | undefined): boolean {
    return !!item && !(item as game.Wall)?.block;
  }

  public move(item: game.Unit | game.Wall | null) {
    if (item instanceof Unit) {
      this.service.moveUnit(item)

    }
  }
}
