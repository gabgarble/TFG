import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvailableHoursComponent } from './available-hours.component';
import { SharedModule } from '../../shared/shared.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  declarations: [AvailableHoursComponent]
})
export class AvailableHoursModule { }
