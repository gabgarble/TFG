import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

/* Components */
import { SpinnerComponent } from './components/spinner/spinner.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

/* Calendar */
import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
]);

/* PrimeNg */
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { PasswordModule } from 'primeng/password';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MenubarModule,
  ],
  providers: [DatePipe, ConfirmationService],
  declarations: [SpinnerComponent, NavBarComponent],
  exports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerComponent,
    NavBarComponent,
    MenubarModule,
    ButtonModule,
    TabViewModule,
    TableModule,
    CardModule,
    TriStateCheckboxModule,
    DropdownModule,
    InputTextareaModule,
    InputTextModule,
    PanelModule,
    AvatarModule,
    PasswordModule,
    FullCalendarModule,
    ChipsModule,
    DialogModule,
    CalendarModule,
    MultiSelectModule,
    ConfirmDialogModule
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
    };
  }
}
