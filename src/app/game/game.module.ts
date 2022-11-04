import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './field/field.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { UnitComponent } from './unit/unit.component';
import { AcceptableDirectionDirective } from './acceptable-direction.directive';


@NgModule({
  declarations: [
    FieldComponent,
    UnitComponent,
    AcceptableDirectionDirective
  ],
  exports: [
    FieldComponent
  ],
  imports: [
    CommonModule, DragDropModule
  ]
})
export class GameModule {
}
