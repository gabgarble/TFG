import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-available-hours',
  templateUrl: './available-hours.component.html',
  styleUrls: ['./available-hours.component.scss']
})
export class AvailableHoursComponent implements OnInit {

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek',
    weekends: false
  };

  public viewDate: Date = new Date();
  public refresh: Subject<any> = new Subject();
  public CalendarView = CalendarView;
  public view: CalendarView = CalendarView.Week;
  public activeDayIsOpen: boolean = true;

  public views: string[] = ["Day", "Week", "Month"];

  public users: string;

  public events: CalendarEvent[] = [
    {
      start: new Date('2022-07-26T10:00:00.000Z'),
      end: new Date('2022-07-26T15:00:00.000Z'),
      title: '',
      color: colors.red,
      //actions: this.actions,
      allDay: false,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date('2022-07-24T09:00:00:00.000Z'),
      end: new Date('2022-07-24T14:00:00.000Z'),
      title: '',
      color: colors.yellow,
      //actions: this.actions,
    },
    {
      start: new Date('2022-07-27T09:00:00.000Z'),
      end: new Date('2022-07-27T10:00:00.000Z'),
      title: '',
      color: colors.blue,
      allDay: false,
    },
    {
      start: new Date('2022-07-29T12:00:00.000Z'),
      end: new Date('2022-07-29T14:00:00.000Z'),
      title: '',
      color: colors.yellow,
      //actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date('2022-07-29T15:00:00.000Z'),
      end: new Date('2022-07-29T17:00:00.000Z'),
      title: '',
      color: colors.blue,
      //actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  public handleEvent(action: string, event: CalendarEvent): void {

  }

  public eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    /*this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });*/
    this.handleEvent('Dropped or resized', event);
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
