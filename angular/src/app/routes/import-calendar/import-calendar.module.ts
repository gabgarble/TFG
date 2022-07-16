import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ImportCalendarComponent } from './import-calendar.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ImportCalendarComponent]
})
export class AvailableHoursModule { }
