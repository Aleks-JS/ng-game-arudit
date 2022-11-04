import { Directive, ElementRef, HostBinding, Input } from '@angular/core';
import { game } from './model';

@Directive({
  selector: '[acceptableDirection]'
})
export class AcceptableDirectionDirective {

  // @HostBinding('class.active')
  // get active(): boolean {
  //   return acceptableDirection
  // }

  private _data:  game.Coordinates[] = [];
  @Input()
  set acceptableDirection(data: game.Coordinates[]) {
    data.forEach(d => {

    })
    this._data = data;
  };

  constructor(
    private ref: ElementRef
  ) { }

}
