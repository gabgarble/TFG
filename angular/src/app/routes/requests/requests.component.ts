import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User, UserPetition } from 'src/app/shared/models';
import { UserPetitionService, UserService } from 'src/app/shared/services';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {
  
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
    {name: "Gabriel Garcia",email: "ggarcia@gmail.com", petitionId: 1},
    {name: "Miquel Soler",email: "msoler@gmail.com", petitionId: 2},
    {name: "Ricardo Tormo",email: "rtormo@gmail.com", petitionId: 3},
    {name: "Gema Navarro",email: "gnavarro@gmail.com", petitionId: 4},
    {name: "Laura Ripoll",email: "lripoll@gmail.com", petitionId: 5},
    {name: "Maria Llopis",email: "mllopis@gmail.com", petitionId: 6},
    {name: "Tono Ordiñana",email: "tordiñana@gmail.com", petitionId: 7},
    {name: "Raul Blesa",email: "rblesa@gmail.com", petitionId: 8}
  ];

  public pendingEvents: any[] = [
    {eventId: 1, eventName: "Reunión semanal", userName: "Miquel Soler",userEmail: "msoler@gmail.com",scheduled: "18/07/2022 10:00 - 18/07/2022 10:30"},
    {eventId: 2, eventName: "Presentación proyecto", userName: "Miquel Soler",userEmail: "msoler@gmail.com",scheduled: "19/07/2022 15:00 - 19/07/2022 16:30"},
    {eventId: 3, eventName: "Reunión seguimiento", userName: "Ricardo Tormo",userEmail: "rtormo@gmail.com",scheduled: "25/07/2022 09:00 - 25/07/2022 09:45"},
    {eventId: 4, eventName: "Entorno de pruebas", userName: "Gema Navarro",userEmail: "gnavarro@gmail.com",scheduled: "07/07/2022 10:00 - 07/07/2022 11:00"},
    {eventId: 5, eventName: "Seguimiento proyecto", userName: "Gema Navarro",userEmail: "gnavarro@gmail.com",scheduled: "12/07/2022 10:00 - 12/07/2022 10:30"}
  ];

  public usersManagementForm: FormGroup;

  //Subscription
  private manageUsersSubscription: Subscription;
  private getUserByEmailSubscription: Subscription;
  private getPendingPetitionsSubscription: Subscription;

  //Loadings
  public loadingManageUsers: boolean = true;
  public loadingPendingPetitions: boolean = true;
  public loadingUsers: boolean = true;

  public addedUsers: User[];

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private userPetitionService: UserPetitionService,
  ) {}

  ngOnInit() {
    this.initUsersManagementForm();
    this.getAllPendingPetitions();
  }

  ngOnDestroy() {
    this.manageUsersSubscription ? this.manageUsersSubscription.unsubscribe() : undefined;
    this.getUserByEmailSubscription ? this.getUserByEmailSubscription.unsubscribe() : undefined;
    this.getPendingPetitionsSubscription ? this.getPendingPetitionsSubscription.unsubscribe() : undefined;
  }

  /* Users Management */
  public initUsersManagementForm() {
    this.usersManagementForm = this.formBuilder.group({
      'userEmail': [null, Validators.required]
    });
  }

  //User petitions
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
    this.pendingUsers = this.pendingUsers.filter(x => x.petitionId != petitionId);
  }

  public declineUserPetition(petitionId: number) {
    console.log(petitionId);

    var petition: UserPetition = {
      id: petitionId,
      petitionStatus: 2
    }

    this.manageUserPetition(petition);
    this.pendingUsers = this.pendingUsers.filter(x => x.petitionId != petitionId);
  }

  //Event petitions
  public acceptEventPetition(eventId: number) {
    this.pendingEvents = this.pendingEvents.filter(x => x.eventId != eventId);
  }

  public declineEventPetition(eventId: number) {
    this.pendingEvents = this.pendingEvents.filter(x => x.eventId != eventId);
  }

  public manageUserPetition(petition: UserPetition) {
    this.manageUsersSubscription ? this.manageUsersSubscription.unsubscribe() : undefined;
    this.loadingManageUsers = true;

    this.manageUsersSubscription = this.userPetitionService.update(petition)
      .subscribe(
        data => {
          this.loadingManageUsers = false;
        },
        error => {
          this.loadingManageUsers = false;
          console.error("Error manageUserPetition: ", error);
        }
      );
  }

  public addNewUser(petition: UserPetition) {
    this.manageUsersSubscription ? this.manageUsersSubscription.unsubscribe() : undefined;
    this.loadingManageUsers = true;

    this.manageUsersSubscription = this.userPetitionService.add(petition)
      .subscribe(
        data => {
          this.loadingManageUsers = false;
        },
        error => {
          this.loadingManageUsers = false;
          console.error("Error addNewUser: ", error);
        }
      );
  }

  public getUserByEmail(userEmail: string): User {
    this.getUserByEmailSubscription ? this.getUserByEmailSubscription.unsubscribe() : undefined;
    this.loadingUsers = true;

    this.getUserByEmailSubscription = this.userService.getUserByEmail(userEmail)
      .subscribe(
        data => {
          this.loadingUsers = false;
          return data;
        },
        error => {
          this.loadingUsers = false;
          console.error("Error updateUser: ", error);
          return null;
        }
      );

    return null;
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

}
