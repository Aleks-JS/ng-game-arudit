import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { Unit } from '../unit';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { game } from '../model';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.css'],
  host: {
    class: 'unit'
  }
})
export class UnitComponent implements OnInit {

  public unit$ = new BehaviorSubject<game.Unit | null>(null);

  @HostBinding('class')
  get color(): string {
    return this.unit$.getValue()?.color || 'empty';
  }

  @Input()
  set unit (value: unknown) {
    this.unit$.next(value as game.Unit)
  };

  constructor() { }

  ngOnInit(): void {
  }

}
