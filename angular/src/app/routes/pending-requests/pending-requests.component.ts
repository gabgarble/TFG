import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss'],
})
export class PendingRequestsComponent implements OnInit {
  
  public pendingEventsCols: any [] = [
    { field: 'actions', header: 'Actions' },
    { field: 'eventName', header: 'Event name' },
    { field: 'userName', header: 'User name' },
    { field: 'userEmail', header: 'User email' },
    { field: 'scheduled', header: 'Scheduled' }
  ];

  public pendingUsersCols: any [] = [
    { field: 'actions', header: 'Actions' },
    { field: 'name', header: 'Name' },
    { field: 'email', header: 'Email' }
  ];

  public pendingUsers: any[] = [
    {name: "Gabriel Garcia",email: "ggarcia@gmail.com"},
    {name: "Miquel Soler",email: "msoler@gmail.com"},
    {name: "Ricardo Tormo",email: "rtormo@gmail.com"},
    {name: "Gema Navarro",email: "gnavarro@gmail.com"},
    {name: "Laura Ripoll",email: "lripoll@gmail.com"},
    {name: "Maria Llopis",email: "mllopis@gmail.com"},
    {name: "Tono Ordiñana",email: "tordiñana@gmail.com"},
    {name: "Raul Blesa",email: "rblesa@gmail.com"}
  ];

  public pendingEvents: any[] = [
    {eventName: "Reunión semanal", userName: "Miquel Soler",userEmail: "msoler@gmail.com",scheduled: "18/07/2022 10:00 - 18/07/2022 10:30"},
    {eventName: "Presentación proyecto", userName: "Miquel Soler",userEmail: "msoler@gmail.com",scheduled: "19/07/2022 15:00 - 19/07/2022 16:30"},
    {eventName: "Reunión seguimiento", userName: "Ricardo Tormo",userEmail: "rtormo@gmail.com",scheduled: "25/07/2022 09:00 - 25/07/2022 09:45"},
    {eventName: "Entorno de pruebas", userName: "Gema Navarro",userEmail: "gnavarro@gmail.com",scheduled: "07/07/2022 10:00 - 07/07/2022 11:00"},
    {eventName: "Seguimiento proyecto", userName: "Gema Navarro",userEmail: "gnavarro@gmail.com",scheduled: "12/07/2022 10:00 - 12/07/2022 10:30"}
  ];

  constructor() {}

  ngOnInit() {

  }
}
