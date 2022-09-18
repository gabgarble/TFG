import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarService, ColorService, UserPetitionService, UserService } from '../../shared/services';
import { Color, MenuItem, User, UserPetition } from 'src/app/shared/models';
import { EventService } from '../../shared/services/event.service';
import { ConfirmationService } from 'primeng/api';
import { zhCN } from 'date-fns/locale';
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
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  /* Default active TABs */
  public defaultActiveTabSettings = 1;
  public defaultActiveTabImport = 1;
  public defaultActiveTabUsers = 1;

  /* Display Modals */
  public displayAddEventModal: boolean = false;
  public displayModifyEventModal: boolean = false;

  /* Forms */
  public eventForm: FormGroup;
  public changeSettingsForm: FormGroup;
  public settingsForm: FormGroup;
  public importCalendarForm: FormGroup;
  public changePasswordForm: FormGroup;

  /* Loadings */
  public loadingSettings: boolean = true;
  public loadingEvents: boolean = true;
  public loadingUsers: boolean = true;
  public loadingManageCalendar: boolean = true;
  public loadingUpdateUser: boolean = true;
  public loadingAddNewEvent: boolean = true;
  public loadingAddedUsers: boolean = true;

  /* New event times and dates */
  public startTime = { hour: 0, minute: 0 };
  public endTime = { hour: 0, minute: 0 };
  public startDate = { year: 0, month: 0, day: 0 };
  public endDate = { year: 0, month: 0, day: 0 };

  /* Views */
  public view: CalendarView = CalendarView.Month;
  public viewDate: Date = new Date();

  public views: string[] = ["Day", "Week", "Month"];
  public selectedView: string = "Month";

  public modalData: {
    action: string;
    event: CalendarEvent;
  };

  public actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edit', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Delete', event);
      },
    },
  ];

  public refresh: Subject<any> = new Subject();

  // public events: CalendarEvent[];
  public availableHours: CalendarEvent[];

  public selectedAddedUsers: User[] = [];
  public addedUsers: User[] = [];
  public colors: Color[];
  public events: CalendarEvent[] = [];
  /*public events: CalendarEvent[] = [
    {
      id: 1,
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      id: 2,
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      id: 3,
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      id: 4,
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];*/

  public activeDayIsOpen: boolean = true;

  /* Subscription */
  private calendarSubscription: Subscription;
  private colorSubscription: Subscription;
  private getAddedUserSubscription: Subscription;
  private updateUserSubscription: Subscription;
  private addNewEventSubscription: Subscription;
  private manageCalendarsSubscription: Subscription;
  private getEventsSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private colorService: ColorService,
    private userService: UserService,
    private userPetitionService: UserPetitionService,
    private eventeService: EventService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadingEvents = true;
    this.events = this.notificationService.getEvents();
    this.events.forEach(event => event.actions = this.actions);
    this.loadingEvents = false;

    this.initEventForm();
    this.initSettingsForm();
    this.initImportCalendarForm();
    this.initChangePasswordForm();
    // this.getAllAddedUsers();
    this.getAllEvents("1");
  }

  ngOnDestroy() {
    this.calendarSubscription ? this.calendarSubscription.unsubscribe() : undefined;
    this.colorSubscription ? this.colorSubscription.unsubscribe() : undefined;
    this.getAddedUserSubscription ? this.getAddedUserSubscription.unsubscribe() : undefined;
    this.updateUserSubscription ? this.updateUserSubscription.unsubscribe() : undefined;
    this.manageCalendarsSubscription ? this.manageCalendarsSubscription.unsubscribe() : undefined;
    this.addNewEventSubscription ? this.addNewEventSubscription.unsubscribe() : undefined;
    this.getEventsSubscription ? this.getEventsSubscription.unsubscribe() : undefined;
  }

  /* Petitions to the server */

  public getAllEvents(userId: string) {
    this.getEventsSubscription ? this.getEventsSubscription.unsubscribe() : undefined;
    this.loadingEvents = false;

    this.getEventsSubscription = this.eventeService.getAllEvents(userId)
      .subscribe(
        data => {
          this.events = data;
          this.events.forEach(x => {
            x.start = new Date(x.start)
            x.end = new Date(x.end)
          });
          this.loadingEvents = false;
          console.log(this.loadingEvents);
        },
        error => {
          this.loadingEvents = false;
          console.error("Error getAllEvents: ", error);
        }
      );
  }

  public addNewEvent(event: CalendarEvent) {
    this.addNewEventSubscription ? this.addNewEventSubscription.unsubscribe() : undefined;
    this.loadingAddNewEvent = true;

    this.addNewEventSubscription = this.eventeService.add(event)
      .subscribe(
        data => {
          //this.colors = data;
          this.loadingAddNewEvent = false;
        },
        error => {
          this.loadingAddNewEvent = false;
          console.error("Error addNewEvent: ", error);
        }
      );
  }

  public getAllColors() {
    this.colorSubscription ? this.colorSubscription.unsubscribe() : undefined;

    this.colorSubscription = this.colorService.getAll()
      .subscribe(
        data => {
          this.colors = data;
        },
        error => {
          console.error("Error getAllColors: ", error);
        }
      );
  }

  public updateUser(user: User) {
    this.updateUserSubscription ? this.updateUserSubscription.unsubscribe() : undefined;
    this.loadingUpdateUser = true;

    this.updateUserSubscription = this.userService.update(user)
      .subscribe(
        data => {
          //this.colors = data;
          this.loadingUpdateUser = false;
        },
        error => {
          this.loadingUpdateUser = false;
          console.error("Error updateUser: ", error);
        }
      );
  }

  public importCalendarPetition() {
    this.manageCalendarsSubscription ? this.manageCalendarsSubscription.unsubscribe() : undefined;
    this.loadingManageCalendar = false;

    this.manageCalendarsSubscription = this.colorService.getAll()
      .subscribe(
        data => {
          this.colors = data;
          this.loadingManageCalendar = true;
        },
        error => {
          this.loadingManageCalendar = true;
          console.error("Error importCalendarPetition: ", error);
        }
      );
  }

  public manageImportedCalendars() {
    this.manageCalendarsSubscription ? this.manageCalendarsSubscription.unsubscribe() : undefined;
    this.loadingManageCalendar = true;

    this.manageCalendarsSubscription = this.colorService.getAll()
      .subscribe(
        data => {
          this.colors = data;
          this.loadingManageCalendar = false;
        },
        error => {
          this.loadingManageCalendar = false;
          console.error("Error manageImportedCalendars: ", error);
        }
      );
  }

  public getAllAddedUsers() {
    this.getAddedUserSubscription ? this.getAddedUserSubscription.unsubscribe() : undefined;
    this.loadingAddedUsers = true;

    this.getAddedUserSubscription = this.userPetitionService.getUsersInformation("1", "accepted")
      .subscribe(
        data => {
          this.addedUsers = data;
          this.loadingAddedUsers = false;
        },
        error => {
          this.loadingAddedUsers = false;
          console.error("Error getAllAddedUsers: ", error);
        }
      );
  }

  public dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  public eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('DroppeOrResize', event);
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    switch (action) {
      case 'Delete':
        this.deleteEvent(event);
        break;
      case 'Edit':
        this.editEvent(event);
        break;
      case 'DroppeOrResize':

        break;
      case 'Click':
        this.editEvent(event);
        break;
    }
  }

  public editEvent(event: CalendarEvent) {
    this.eventForm.get("id").setValue(event.id);
    this.eventForm.get("title").setValue(event.title);
    this.eventForm.get("start").setValue(event.start);
    this.eventForm.get("end").setValue(event.end);
    this.eventForm.get("allDay").setValue(event.allDay);
    this.eventForm.get("userEmail").setValue(event.userEmail);
    this.eventForm.get("description").setValue(event.description);
    this.eventForm.get("actions").setValue(event.actions);
    this.eventForm.get("color").setValue(event.color);

    this.displayModifyEventModal = true;
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  public close() {
    this.displayAddEventModal = false;
    this.displayModifyEventModal = false;
  }

  /* Open modals */
  public openAddEventModal() {
    this.eventForm.reset();
    this.displayAddEventModal = true;
    var currentDate = new Date();

    this.startTime = { hour: currentDate.getHours(), minute: currentDate.getMinutes() };
    currentDate = new Date(currentDate.getTime() + (30 * 60 * 1000));
    this.endTime = { hour: currentDate.getHours(), minute: currentDate.getMinutes() };

    this.startDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    this.endDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
  }

  /* New event */
  public initEventForm() {
    this.eventForm = this.formBuilder.group({
      'id': [null, Validators.nullValidator],
      'title': [null, Validators.required],
      'start': [null, Validators.nullValidator],
      'end': [null, Validators.nullValidator],
      'allDay': [null, Validators.nullValidator],
      'automaticDate': [null, Validators.nullValidator],
      'userEmail': [null, Validators.nullValidator],
      'description': [null, Validators.nullValidator],
      'actions': [null, Validators.nullValidator],
      'color': [null, Validators.nullValidator]
    });
  }

  public saveNewEvent(event: CalendarEvent) {
    this.loadingEvents = true;
    var id = this.events[this.events.length - 1].id + 1;
    event.id = id;
    event.color = colors.yellow;
    //this.events.push(event);
    this.notificationService.addEvent(event);
    this.events = this.notificationService.getEvents();
    this.displayAddEventModal = false;
    this.loadingEvents = false;
  }

  public editNewEvent(event: CalendarEvent) {
    this.loadingEvents = true;
    /*this.events = this.events.filter(x => x.id != event.id);
    this.events.push(event);*/
    this.notificationService.updateEvent(event);
    this.events = this.notificationService.getEvents();
    this.displayModifyEventModal = false;
    this.loadingEvents = false;
  }

  public deleteEvent(eventToDelete: CalendarEvent) {
    this.confirmationService.confirm({
      message: 'Are you sure that you want to perform this action?',
      accept: () => {
        this.loadingEvents = true;
        this.notificationService.deleteEvent(eventToDelete);
        this.events = this.notificationService.getEvents();
        //this.events = this.events.filter((event) => event !== eventToDelete);
        this.loadingEvents = false;
      }
    });
  }

  /* Settings */
  public initSettingsForm() {
    this.settingsForm = this.formBuilder.group({
      'name': [null, Validators.required],
      'surname': [null, Validators.required],
      'username': [null, Validators.required],
      'email': [null, [Validators.email]]
    });
  }

  public initChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      'password': [null, [Validators.minLength(6), Validators.required]],
      'confirmPassword': [null, [Validators.minLength(6), Validators.required]]
    }, { validator: this.checkIfMatchingPasswords('password', 'confirmPassword') });
  }

  public saveSettings(value: any) {
    console.log(value);
    var user: User = {
      id: value.id,
      email: value.email,
      username: value.username,
      name: value.name,
      surname: value.surname
    }

    this.updateUser(user);
  }

  public changePassword(value: any) {
    console.log(value);

    var user: User = {
      id: value.id,
      password: value.password
    }

    this.updateUser(user);
  }

  /* Import Calendar */
  public initImportCalendarForm() {
    this.importCalendarForm = this.formBuilder.group({
      'calendarName': [null, Validators.required],
      'file': [null, Validators.required]
    });
  }

  public importCalendar(value: any) {
    console.log(value);
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.importCalendarForm.patchValue({
        fileSource: file
      });
    }
  }

  /* Checking password */
  private checkIfMatchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
      let passwordInput = group.controls[passwordKey],
        passwordConfirmationInput = group.controls[passwordConfirmationKey];
      if (passwordInput.value !== passwordConfirmationInput.value) {
        return passwordConfirmationInput.setErrors({ notEquivalent: true })
      }
      else {
        return passwordConfirmationInput.setErrors(null);
      }
    }
  }

  //Change calendar view
  public selectedViewChanged() {
    switch (this.selectedView) {
      case 'Month': {
        this.view = CalendarView.Month;
        break;
      }
      case 'Week': {
        this.view = CalendarView.Week;
        break;
      }
      case 'Day': {
        this.view = CalendarView.Day;
        break;
      }
      default: {
        this.view = CalendarView.Month;
        break;
      }
    }
  }

}
