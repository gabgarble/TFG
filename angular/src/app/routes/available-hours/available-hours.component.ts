import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addDays, addHours, endOfMonth, startOfDay, subDays } from 'date-fns';
import { NotificationService } from 'src/app/shared/services/notification.service';

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

  public users: string[];

  public events: CalendarEvent[] = [];

  constructor(
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    
  }

  seacrhHours () {
    this.events = this.notificationService.getAvailableHours(this.users);
    console.log(this.events);
  }

  public handleEvent(
    action: string,
     event: CalendarEvent
  ): void {

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
