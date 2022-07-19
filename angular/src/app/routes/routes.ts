import { AvailableHoursComponent } from './available-hours/available-hours.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ImportCalendarComponent } from './import-calendar/import-calendar.component';
import { LoginComponent } from './login/login.component';
import { RequestsComponent } from './requests/requests.component';
import { SettingsComponent } from './settings/settings.component';

export const routes = [

    // Default
    { path: '', redirectTo: 'login', pathMatch: 'full', data: {menuDisplay: false} },

    // Routes
    /*{
        path: '',
        component: CalendarComponent,
        children: [
            { path: 'orders', loadChildren: './orders/orders.module#OrdersModule' }
        ]
    },*/

    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent, data: {icon: 'pi pi-user', label: 'Login', menuDisplay: false} },
    { path: 'calendar', component: CalendarComponent, data: {icon: 'pi pi-calendar', label: 'Calendar', menuDisplay: true} },
    { path: 'available-hours', component: AvailableHoursComponent, data: {icon: 'pi pi-clock', label: 'Available Hours', menuDisplay: true} },
    { path: 'import-calendar', component: ImportCalendarComponent, data: {icon: 'pi pi-calendar-plus', label: 'Import Calendar', menuDisplay: true} },
    { path: 'pending-requests', component: RequestsComponent, data: {icon: 'pi pi-bookmark', label: 'Requests', menuDisplay: true} },
    { path: 'settings', component: SettingsComponent, data: {icon: 'pi pi-cog', label: 'Settings', menuDisplay: true}  },

    // Not found
    { path: '**', redirectTo: 'login', data: {menuDisplay: false} }
];