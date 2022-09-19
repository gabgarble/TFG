import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/shared/models';
import { NotificationService } from 'src/app/shared/services/notification.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public user: User;
  public password: string;
  public repeatPassword: string;

  /* Forms */
  public userForm: FormGroup;

  constructor(
      private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.user = this.notificationService.getAppUser();
    this.initUserForm();
  }

  public initUserForm() {
    this.userForm = this.formBuilder.group({
      'id': [this.user.id, Validators.nullValidator],
      'email': [this.user.email, Validators.nullValidator],
      'name': [this.user.name, Validators.nullValidator],
      'surname': [this.user.surname, Validators.nullValidator],
      'username': [this.user.username, Validators.nullValidator],
      'password': [this.user.password, Validators.nullValidator],
    });
  }

}
