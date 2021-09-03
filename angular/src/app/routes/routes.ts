import { CalendarComponent } from './calendar/calendar.component';
import { LoginComponent } from './login/login.component';

export const routes = [

    // Default
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Routes
    /*{
        path: '',
        component: CalendarComponent,
        children: [
            { path: 'orders', loadChildren: './orders/orders.module#OrdersModule' }
        ]
    },*/

    // Not lazy-loaded routes
    { path: 'login', component: LoginComponent },
    { path: 'calendar', component: CalendarComponent },

    // Not found
    { path: '**', redirectTo: 'login' }
];