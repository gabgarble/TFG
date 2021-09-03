import { Injectable } from '@angular/core';
import { Adapter } from '../../core/adapter/adapter';
import { BaseFilters } from './common/base-filters.model';
import { BaseModel } from './common/base.model';

export class Calendar extends BaseModel<number> {
  public calendarName: string;
}

@Injectable({
  providedIn: 'root'
})
export class CalendarAdapter implements Adapter<Calendar> {
  adapt(item: any): Calendar {
      const calendar = new Calendar();
      calendar.id = item.id;
      calendar.calendarName = item.calendarName;

      return calendar;
  }
}

@Injectable({
  providedIn: 'root'
})
export class FilteredCalendarAdapter implements Adapter<BaseFilters<Calendar>> {
  adapt(object: BaseFilters<any>): BaseFilters<Calendar> {
      const items = [];
      object.items.forEach(element => {
          var item = new Calendar();
          item.id = element.id;
          item.calendarName = element.calendarName;

          items.push(item);
      });

      object.items = items;
      return object;
  }
} 