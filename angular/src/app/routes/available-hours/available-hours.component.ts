import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/angular';
import { CalendarEvent, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';

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
  public events: CalendarEvent[];
  public refresh: Subject<any> = new Subject();
  public CalendarView = CalendarView;
  public view: CalendarView = CalendarView.Month;
  public activeDayIsOpen: boolean = true;

  public views: string[] = ["Day", "Week", "Month"];
  public selectedView: string = "Week";

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

  public setView() {
    console.log(this.selectedView);
    switch (this.selectedView) {
      case "Day":
        this.view = CalendarView.Day;
      case "Week":
        this.view = CalendarView.Week;
      case "Month":
        this.view = CalendarView.Month;
      default:
        this.view = CalendarView.Week;
    }
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
