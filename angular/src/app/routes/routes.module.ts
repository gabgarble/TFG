import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginModule } from './login/login.module';
import { CalendarsModule } from './calendar/calendar.module';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { routes } from './routes';
import { AvailableHoursModule } from './available-hours/available-hours.module';

@NgModule({
  imports: [
    LoginModule,
    CalendarsModule,
    CommonModule,
    SharedModule,
    RouterModule.forRoot(routes)
  ],
  declarations: [],
  exports: [RouterModule],
})
export class RoutesModule {
  
}
