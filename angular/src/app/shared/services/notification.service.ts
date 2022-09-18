import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { zhCN } from 'date-fns/locale';


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

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  public events: CalendarEvent[] = [
    {
      id: 1,
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      //actions: this.actions,
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
      //actions: this.actions,
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
      //actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];

  public pendingEvents: any[] = [
    { eventId: 1, eventName: "Reunión semanal", userName: "Miquel Soler", userEmail: "msoler@gmail.com", scheduled: "18/07/2022 10:00:00 - 18/07/2022 10:30:00" },
    { eventId: 2, eventName: "Presentación proyecto", userName: "Miquel Soler", userEmail: "msoler@gmail.com", scheduled: "19/07/2022 15:00:00 - 19/07/2022 16:30:00" },
    { eventId: 3, eventName: "Reunión seguimiento", userName: "Ricardo Tormo", userEmail: "rtormo@gmail.com", scheduled: "25/07/2022 09:00:00 - 25/07/2022 09:45:00" },
    { eventId: 4, eventName: "Entorno de pruebas", userName: "Gema Navarro", userEmail: "gnavarro@gmail.com", scheduled: "07/07/2022 10:00:00 - 07/07/2022 11:00:00" },
    { eventId: 5, eventName: "Seguimiento proyecto", userName: "Gema Navarro", userEmail: "gnavarro@gmail.com", scheduled: "12/07/2022 10:00:00 - 12/07/2022 10:30:00" }
  ];

  public pendingUsers: any[] = [
    {name: "Gabriel Garcia",email: "ggarcia@gmail.com", petitionId: 1},
    {name: "Miquel Soler",email: "msoler@gmail.com", petitionId: 2},
    {name: "Ricardo Tormo",email: "rtormo@gmail.com", petitionId: 3},
    {name: "Gema Navarro",email: "gnavarro@gmail.com", petitionId: 4},
  ];

  public users: any[] = [
    {name: "Laura Ripoll",email: "lripoll@gmail.com", petitionId: 5},
    {name: "Maria Llopis",email: "mllopis@gmail.com", petitionId: 6},
    {name: "Tono Ordiñana",email: "tordiñana@gmail.com", petitionId: 7},
    {name: "Raul Blesa",email: "rblesa@gmail.com", petitionId: 8}
  ];

  constructor() { }

  getEvents() {
    return this.events;
  }

  updateEvent(event: CalendarEvent) {
    this.events = this.events.filter(x => x.id != event.id);
    this.events.push(event);
  }

  addEvent(event: CalendarEvent) {
    this.events.push(event);
  }

  deleteEvent(event: CalendarEvent) {
    this.events = this.events.filter((event) => event !== event);
  }

  getPendingEvents() {
    return this.pendingEvents;
  }

  removePendingEvent(eventId: number) {
    this.pendingEvents = this.pendingEvents.filter(x => x.eventId != eventId);
    return this.pendingEvents;
  }

  addPendingEvent(eventId: number) {

    var pendigEvent = this.pendingEvents.filter(x => x.eventId == eventId)[0];

    const str = pendigEvent.scheduled.split('-');
    
    str[0] = str[0].trim();
    str[1] = str[1].trim();

    const [dateComponents, timeComponents] = str[0].split(' ');
    const [day, month, year] = dateComponents.split('/');
    const [hours, minutes, seconds] = timeComponents.split(':');
    const start = new Date(year, month-1, day, hours, minutes, seconds);

    const [dateComponents2, timeComponents2] = str[1].split(' ');
    const [day2, month2, year2] = dateComponents.split('/');
    const [hours2, minutes2, seconds2] = timeComponents.split(':');
    const end = new Date(year2, month2-1, day2, hours2, minutes2, seconds2);

    var id = this.events[this.events.length - 1].id + 1;
    var event = {
      id: id,
      start: start,
      end: end,
      title: pendigEvent.eventName,
      color: colors.red,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    };

    this.events.push(event);

    this.pendingEvents = this.pendingEvents.filter(x => x.eventId != eventId);
    return this.pendingEvents;
  }

  getUsers() {
    return this.users;
  }

  getPendingUsers(){
    return this.pendingUsers;
  }

  addUser(petitionId: number){
    var newUser = this.pendingUsers.filter(x => x.petitionId == petitionId)[0];
    this.users.push(newUser);
    this.pendingUsers = this.pendingUsers.filter(x => x.petitionId != petitionId);
    return this.pendingUsers;
  }

  declineUserPetition(petitionId: number){
    this.pendingUsers = this.pendingUsers.filter(x => x.petitionId != petitionId);
    return this.pendingUsers;
  }

}
