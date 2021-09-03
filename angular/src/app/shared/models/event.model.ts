import { Injectable } from '@angular/core';
import { Adapter } from '../../core/adapter/adapter';
import { BaseFilters } from './common/base-filters.model';
import { BaseModel } from './common/base.model';

export class CalendarEvent<MetaType = any> {
    id?: string | number;
    start: Date;
    end?: Date;
    title: string;
    color?: EventColor;
    actions?: EventAction[];
    allDay?: boolean;
    cssClass?: string;
    resizable?: {
        beforeStart?: boolean;
        afterEnd?: boolean;
    };
    draggable?: boolean;
    meta?: MetaType;
}

export interface EventColor {
    primary: string;
    secondary: string;
}

export interface EventAction {
    id?: string | number;
    label: string;
    cssClass?: string;
    a11yLabel?: string;
    onClick({ event, sourceEvent, }: {
        event: CalendarEvent;
        sourceEvent: MouseEvent | KeyboardEvent;
    }): any;
}

@Injectable({
    providedIn: 'root'
})
export class CalendarEventAdapter implements Adapter<CalendarEvent> {
    adapt(item: any): CalendarEvent {
        const calendarEvent = new CalendarEvent();
        calendarEvent.id = item.id;
        calendarEvent.start = item.start;
        calendarEvent.end = item.end;
        calendarEvent.title = item.title;
        calendarEvent.color = item.color;
        calendarEvent.actions = item.actions;
        calendarEvent.allDay = item.allDay;
        calendarEvent.resizable = item.resizable;
        calendarEvent.draggable = item.draggable;

        return calendarEvent;
    }
}

@Injectable({
    providedIn: 'root'
})
export class FilteredCalendarEventdapter implements Adapter<BaseFilters<CalendarEvent>> {
    adapt(object: BaseFilters<any>): BaseFilters<CalendarEvent> {
        const items = [];
        object.items.forEach(element => {
            var item = new CalendarEvent();
            item.id = element.id;
            item.start = element.start;
            item.end = element.end;
            item.title = element.title;
            item.color = element.color;
            item.actions = element.actions;
            item.allDay = element.allDay;
            item.resizable = element.resizable;
            item.draggable = element.draggable;

            items.push(item);
        });

        object.items = items;
        return object;
    }
}