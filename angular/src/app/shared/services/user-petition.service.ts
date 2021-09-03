import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/data-service/api.service';
import { UserPetition, UserPetitionAdapter, FilteredUserPetitionAdapter, User } from '../models';
import { BaseEntityService } from './base-entity.service';

const baseRoute: string = 'petition/';

@Injectable({
    providedIn: 'root',
})
export class UserPetitionService extends BaseEntityService<UserPetition> {
    constructor(
        public apiService: ApiService,
        public userPetitionAdapter: UserPetitionAdapter,
        public filteredUserPetitionAdapter: FilteredUserPetitionAdapter) {
        super(apiService, userPetitionAdapter, baseRoute);
    }

    public getUsersInformation(userId: string, status: string ): Observable<User[]> {
        return this.apiService.get(this.baseRoute + userId + '/' + status);
    }

}