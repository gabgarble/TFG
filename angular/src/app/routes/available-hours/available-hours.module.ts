import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableHoursComponent } from './available-hours.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [AvailableHoursComponent]
})
export class AvailableHoursModule { }
