import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/data-service/api.service';
import { SignIn, User, UserAdapter, SignUp } from '../models';
import { BaseEntityService } from './base-entity.service';

const baseRoute: string = 'user/';

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseEntityService<User> {
    constructor(
        public apiService: ApiService,
        public signInUserInformationAdapter: UserAdapter) {
        super(apiService, signInUserInformationAdapter, baseRoute);
    }

    public getUserInformation(userId: string ): Observable<User> {
        return this.apiService.get(this.baseRoute + 'get-user-information/' + userId);
    }

    public getUserByEmail(email: string ): Observable<User>{
        return this.apiService.get(this.baseRoute + 'get-user-by-email/' + email);
    }

    public getSignInUser(user: SignIn ): Observable<User>{
        return this.apiService.get(this.baseRoute + 'sign-in-user', user);
    }
    
    public postSignUpUser(user: SignUp): Observable<User>{
        return this.apiService.post(this.baseRoute + 'sign-up-user', user);
    }

}