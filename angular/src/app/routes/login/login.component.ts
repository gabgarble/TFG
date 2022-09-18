import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UserService } from '../../shared/services';
import { SignIn, SignUp, User } from '../../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  /* Default active TAB */
  public activeTab = 1;

  /* Forms */
  public signUpForm: FormGroup;
  public signInForm: FormGroup;

  /* Logins */
  public loadingSignUp: boolean = false;
  public loadingSignIn: boolean = false;

  /* User Id */
  public user: User;

  /* Subscription */
  private userSubscription: Subscription;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
  ) {

  }

  ngOnInit() {
    this.initSignUpForm();
    this.initSignInForm();
  }

  ngOnDestroy() {
    this.userSubscription ? this.userSubscription.unsubscribe() : undefined;
  }

  private signUpUser(user: SignUp) {
    this.userSubscription ? this.userSubscription.unsubscribe() : undefined;
    this.loadingSignUp = true;

    this.userSubscription = this.userService.postSignUpUser(user)
      .subscribe(
        data => {
          this.user = data;
          this.loadingSignUp = false;
        },
        error => {
          this.loadingSignUp = false;
          console.log("Error signUpUser: ", error);
        }
      );
  }

  private signInUser(user: SignIn) {
    this.userSubscription ? this.userSubscription.unsubscribe() : undefined;
    this.loadingSignIn = true;

    this.userSubscription = this.userService.getSignInUser(user)
      .subscribe(
        data => {
          this.user = data;
          this.router.navigate(['/calendar']);
          this.loadingSignIn = false;
        },
        error => {
          this.loadingSignIn = false;
          console.log("Error signInUser: ", error);
        }
      );
  }

  public initSignUpForm() {
    this.signUpForm = this.formBuilder.group({
      'username': [null, [Validators.required, Validators.minLength(6)]],
      'email': [null, [Validators.required, Validators.email]],
      'password': [null, [Validators.required, Validators.minLength(6)]],
      'confirmPassword': [null, [Validators.required, Validators.minLength(6)]]
    }, { validator: this.checkIfMatchingPasswords('password', 'confirmPassword') });
  }

  public initSignInForm() {
    this.signInForm = this.formBuilder.group({
      'identification': [null, Validators.required],
      'password': [null, Validators.required]
    });
  }

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

  public submitSignIn(value: any) {
    this.router.navigate(['/calendar']);
    var signInUser: SignIn = {
      email: value.identification,
      password: value.password
    }

    this.signInUser(signInUser);
  }

  public submitSignUp(value: any) {
    var signUpUser: SignUp = {
      username: value.username,
      email: value.email,
      password: value.password
    }

    this.signUpUser(signUpUser);
  }

}
