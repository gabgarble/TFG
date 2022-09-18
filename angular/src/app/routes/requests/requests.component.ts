import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { User, UserPetition } from 'src/app/shared/models';
import { UserPetitionService, UserService } from 'src/app/shared/services';
import { NotificationService } from 'src/app/shared/services/notification.service';

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

  public pendingUsers: any[] = [];

  public pendingEvents: any[] = [];

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
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.pendingEvents = this.notificationService.getPendingEvents();
    this.pendingUsers = this.notificationService.getPendingUsers();
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
    var petition: UserPetition = {
      id: petitionId,
      petitionStatus: 1
    }

    this.manageUserPetition(petition);
    //this.pendingUsers = this.pendingUsers.filter(x => x.petitionId != petitionId);
    this.pendingUsers = this.notificationService.addUser(petitionId);
  }

  public declineUserPetition(petitionId: number) {
    var petition: UserPetition = {
      id: petitionId,
      petitionStatus: 2
    }

    this.manageUserPetition(petition);
    //this.pendingUsers = this.pendingUsers.filter(x => x.petitionId != petitionId);
    this.pendingUsers = this.notificationService.declineUserPetition(petitionId);
  }

  //Event petitions
  public acceptEventPetition(eventId: number) {
    this.pendingEvents = this.notificationService.addPendingEvent(eventId);
    //this.pendingEvents = this.pendingEvents.filter(x => x.eventId != eventId);
  }

  public declineEventPetition(eventId: number) {
    this.pendingEvents = this.notificationService.removePendingEvent(eventId);
    //this.pendingEvents = this.pendingEvents.filter(x => x.eventId != eventId);
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
