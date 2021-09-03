import { Injectable } from '@angular/core';
import { ApiService } from '../../core/data-service/api.service';
import { Calendar, CalendarAdapter, FilteredCalendarAdapter } from '../models';
import { BaseEntityService } from './base-entity.service';

const baseRoute: string = 'calendar/';

@Injectable({
    providedIn: 'root',
})
export class CalendarService extends BaseEntityService<Calendar> {
    constructor(
        public apiService: ApiService,
        public calendarAdapter: CalendarAdapter,
        public filteredCalendarAdapter: FilteredCalendarAdapter) {
        super(apiService, calendarAdapter, baseRoute);
    }

}