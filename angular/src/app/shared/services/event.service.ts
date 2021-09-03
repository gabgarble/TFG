import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/data-service/api.service';
import { CalendarEvent, FilteredCalendarAdapter, CalendarEventAdapter } from '../models';
import { BaseEntityService } from './base-entity.service';

const baseRoute: string = 'event/';

@Injectable({
    providedIn: 'root',
})
export class EventService extends BaseEntityService<CalendarEvent> {
    constructor(
        public apiService: ApiService,
        public calendarEventAdapter: CalendarEventAdapter,
        public filteredCalendarAdapter: FilteredCalendarAdapter) {
        super(apiService, calendarEventAdapter, baseRoute);
    }

    public getAllEvents(userId: string ): Observable<CalendarEvent[]> {
        return this.apiService.get(this.baseRoute + userId);
    }

}