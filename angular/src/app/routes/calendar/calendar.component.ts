import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, OnInit, OnDestroy } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CalendarService, ColorService, UserPetitionService, UserService } from '../../shared/services';
import { Color, MenuItem, User, UserPetition } from 'src/app/shared/models';
import { EventService } from '../../shared/services/event.service';

/*const colors: any = {
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
};*/

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnDestroy {

  /* Menu items */
  public menuItems: MenuItem[] = [
    { key: "settings", value: "Settings", size: "md" },
    { key: "usersManagement", value: "Users Management", size: "md" },
    { key: "calendarsManagement", value: "Calendars Management", size: "lg" }];

  /* Default active TABs */
  public defaultActiveTabSettings = 1;
  public defaultActiveTabImport = 1;
  public defaultActiveTabUsers = 1;

  /* Modals */
  @ViewChild('modifyEventModal', { static: true }) modifyEventModal: TemplateRef<any>;
  @ViewChild('addNewEventModal', { static: true }) addNewEventModal: TemplateRef<any>;
  @ViewChild('settingsModal', { static: true }) settingsModal: TemplateRef<any>;
  @ViewChild('importCalendarModal', { static: true }) importCalendarModal: TemplateRef<any>;
  @ViewChild('usersManagementModal', { static: true }) usersManagementModal: TemplateRef<any>;
  @ViewChild('availableHoursModal', { static: true }) availableHoursModal: TemplateRef<any>;

  /* Forms */
  public addNewEventForm: FormGroup;
  public changeSettingsForm: FormGroup;
  public settingsForm: FormGroup;
  public importCalendarForm: FormGroup;
  public usersManagementForm: FormGroup;
  public changePasswordForm: FormGroup;

  /* Loadings */
  public loadingSettings: boolean = true;
  public loadingEvents: boolean = true;
  public loadingUsers: boolean = true;
  public loadingManageCalendar: boolean = true;
  public loadingManageUsers: boolean = true;
  public loadingUpdateUser: boolean = true;
  public loadingAddNewEvent: boolean = true;
  public loadingAddedUsers: boolean = true;
  public loadingPendingPetitions: boolean = true;

  /* User petitions*/
  public pendingUserPetitions: UserPetition[];

  /* New event times and dates */
  public startTime = { hour: 0, minute: 0 };
  public endTime = { hour: 0, minute: 0 };
  public startDate = { year: 0, month: 0, day: 0 };
  public endDate = { year: 0, month: 0, day: 0 };

  /* Views */
  public view: CalendarView = CalendarView.Month;
  public view2: CalendarView = CalendarView.Week;
  public CalendarView = CalendarView;
  public viewDate: Date = new Date();
  public viewDate2: Date = new Date();

  public modalData: {
    action: string;
    event: CalendarEvent;
  };

  public actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  public refresh: Subject<any> = new Subject();

  public events: CalendarEvent[];
  public availableHours: CalendarEvent[];
  public addedUsers: User[];
  public selectedAddedUsers: User[] = <any>[];
  public colors: Color[];
  /*public events: CalendarEvent[] = [
    {
      startDate: subDays(startOfDay(new Date()), 1),
      endDate: addDays(new Date(), 1),
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
      startDate: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      startDate: subDays(endOfMonth(new Date()), 3),
      endDate: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      startDate: addHours(startOfDay(new Date()), 2),
      endDate: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];
*/

  addedUserInput = new Subject<string>();

  public activeDayIsOpen: boolean = true;

  /* Subscription */
  private calendarSubscription: Subscription;
  private colorSubscription: Subscription;
  private getAddedUserSubscription: Subscription;
  private updateUserSubscription: Subscription;
  private manageUsersSubscription: Subscription;
  private addNewEventSubscription: Subscription;
  private manageCalendarsSubscription: Subscription;
  private getUserByEmailSubscription: Subscription;
  private getEventsSubscription: Subscription;
  private getPendingPetitionsSubscription: Subscription;

  constructor(
    private modal: NgbModal,
    private formBuilder: FormBuilder,
    private calendarService: CalendarService,
    private colorService: ColorService,
    private userService: UserService,
    private userPetitionService: UserPetitionService,
    private eventeService: EventService
  ) { }

  ngOnInit() {
    this.initNewEventForm();
    this.initSettingsForm();
    this.initImportCalendarForm();
    this.initUsersManagementForm();
    this.initChangePasswordForm();
    this.getAllAddedUsers();
    this.getAllPendingPetitions();
    this.getAllEvents("1");
    console.log(this.loadingEvents);
  }

  ngOnDestroy() {
    this.calendarSubscription ? this.calendarSubscription.unsubscribe() : undefined;
    this.colorSubscription ? this.colorSubscription.unsubscribe() : undefined;
    this.getAddedUserSubscription ? this.getAddedUserSubscription.unsubscribe() : undefined;
    this.updateUserSubscription ? this.updateUserSubscription.unsubscribe() : undefined;
    this.manageUsersSubscription ? this.manageUsersSubscription.unsubscribe() : undefined;
    this.manageCalendarsSubscription ? this.manageCalendarsSubscription.unsubscribe() : undefined;
    this.addNewEventSubscription ? this.addNewEventSubscription.unsubscribe() : undefined;
    this.getUserByEmailSubscription ? this.getUserByEmailSubscription.unsubscribe() : undefined;
    this.getEventsSubscription ? this.getEventsSubscription.unsubscribe() : undefined;
    this.getPendingPetitionsSubscription ? this.getPendingPetitionsSubscription.unsubscribe() : undefined;
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
    this.addNewEventSubscription ? this.addNewEventSubscription.unsubscribe() : undefined;
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

  public getUserByEmail(userEmail: string): User {
    this.getUserByEmailSubscription ? this.getUserByEmailSubscription.unsubscribe() : undefined;
    this.loadingUpdateUser = true;

    this.getUserByEmailSubscription = this.userService.getUserByEmail(userEmail)
      .subscribe(
        data => {
          this.loadingUpdateUser = false;
          return data;
        },
        error => {
          this.loadingUpdateUser = false;
          console.error("Error updateUser: ", error);
          return null;
        }
      );

    return null;
  }

  public addNewUser(petition: UserPetition) {
    this.manageUsersSubscription ? this.manageUsersSubscription.unsubscribe() : undefined;
    this.loadingManageUsers = true;

    this.manageUsersSubscription = this.userPetitionService.add(petition)
      .subscribe(
        data => {
          //this.colors = data;
          this.loadingManageUsers = false;
        },
        error => {
          this.loadingManageUsers = false;
          console.error("Error addNewUser: ", error);
        }
      );
  }

  public manageUserPetition(petition: UserPetition) {
    this.manageUsersSubscription ? this.manageUsersSubscription.unsubscribe() : undefined;
    this.loadingManageUsers = true;

    this.manageUsersSubscription = this.userPetitionService.update(petition)
      .subscribe(
        data => {
          //this.colors = data;
          this.loadingManageUsers = false;
        },
        error => {
          this.loadingManageUsers = false;
          console.error("Error manageUserPetition: ", error);
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
    this.loadingManageUsers = true;

    this.manageCalendarsSubscription = this.colorService.getAll()
      .subscribe(
        data => {
          this.colors = data;
          this.loadingManageUsers = false;
        },
        error => {
          this.loadingManageUsers = false;
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

  public getAllPendingPetitions() {
    this.getPendingPetitionsSubscription ? this.getPendingPetitionsSubscription.unsubscribe() : undefined;
    this.loadingPendingPetitions = true;

    this.getPendingPetitionsSubscription = this.userPetitionService.getUsersInformation("1", "pending")
      .subscribe(
        data => {
          this.addedUsers = data;
          this.loadingPendingPetitions = false;
        },
        error => {
          this.loadingPendingPetitions = false;
          console.error("Error getAllPendingPetitions: ", error);
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
    this.handleEvent('Dropped or resized', event);
  }

  public handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modifyEventModal, { size: 'lg' });
  }

  public addEvent(): void {
    /*this.events = [
      ...this.events,
      {
        title: 'New event',
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];*/
  }

  public deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  public setView(view: CalendarView) {
    this.view = view;
  }

  public closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  /* Open modals */
  public openAddEventModal() {
    this.modal.open(this.addNewEventModal, { size: 'lg' });
    var currentDate = new Date();

    this.startTime = { hour: currentDate.getHours(), minute: currentDate.getMinutes() };
    currentDate = new Date(currentDate.getTime() + (30 * 60 * 1000));
    this.endTime = { hour: currentDate.getHours(), minute: currentDate.getMinutes() };

    this.startDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };
    this.endDate = { year: currentDate.getFullYear(), month: currentDate.getMonth() + 1, day: currentDate.getDate() };

  }

  public openAvailableHoursModal() {
    this.modal.open(this.availableHoursModal, { size: 'xl', scrollable: true });
  }

  public openModal(modal: MenuItem) {
    switch (modal.key) {
      case "settings":
        this.modal.open(this.settingsModal, { size: modal.size });
        break;
      case "usersManagement":
        this.modal.open(this.usersManagementModal, { size: modal.size });
        break;
      case "calendarsManagement":
        this.modal.open(this.importCalendarModal, { size: modal.size });
        break;
    }
  }

  /* New event */
  public initNewEventForm() {
    this.addNewEventForm = this.formBuilder.group({
      'title': [null, Validators.required],
      'start': [null, Validators.nullValidator],
      'end': [null, Validators.nullValidator],
      'allDay': [null, Validators.nullValidator],
      'automaticDate': [null, Validators.nullValidator],
      'userEmail': [null, Validators.nullValidator]
    });
  }

  public saveNewEvent(value: any) {
    console.log(value);
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

  /* Users Management */
  public initUsersManagementForm() {
    this.usersManagementForm = this.formBuilder.group({
      'userEmail': [null, Validators.required]
    });
  }

  public sendUserPetition(value: any) {
    console.log(value);

    var user = this.getUserByEmail(value.userEmail);

    var userPetition: UserPetition = {
      id: 0,
      userReceiver: user,
      userSender: null,
      petitionStatus: 3
    };

    this.addNewUser(userPetition);
  }

  public acceptUserPetition(petitionId: number) {
    console.log(petitionId);

    var petition: UserPetition = {
      id: petitionId,
      petitionStatus: 1
    }

    this.manageUserPetition(petition);
  }

  public declineUserPetition(petitionId: number) {
    console.log(petitionId);

    var petition: UserPetition = {
      id: petitionId,
      petitionStatus: 2
    }

    this.manageUserPetition(petition);
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

}
