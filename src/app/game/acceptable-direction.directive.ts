import { Directive, ElementRef, HostBinding, HostListener, Input } from '@angular/core';
import { GameStateService } from './game.state.service';
import { DestroyService } from '../common/destroyService';
import { filter, takeUntil, tap } from 'rxjs';
import { Unit } from './unit';

@Directive({
  selector: '[acceptableDirection]',
  providers: [DestroyService]
})
export class AcceptableDirectionDirective extends DestroyService {

  @HostBinding('class.active')
  private isActive: boolean = false;

  @HostListener('click')
  private clickHandler(): void {
    if (this.isActive) {
      this.service.selectedDirectionCell$.next(this._hostCor);
    }
  }

  private _hostCor!: Unit;

  @Input()
  set acceptableDirection(data: Unit) {
    this._hostCor = data;
    this.service.acceptableDirections$.next([]);
  };

  constructor(
    private ref: ElementRef,
    private service: GameStateService
  ) {
    super();
    this.service.acceptableDirections$.pipe(
      tap((directions) => !directions.length && (this.isActive = false)),
      filter(o => !!o.length),
      takeUntil(this)
    ).subscribe(directions => {
      this.isActive = directions.some(cor => cor.corY === this._hostCor.corY && cor.corX === this._hostCor.corX);
    });
  }

}
