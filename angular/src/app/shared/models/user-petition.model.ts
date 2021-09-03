import { Injectable } from '@angular/core';
import { Adapter } from '../../core/adapter/adapter';
import { BaseFilters } from './common/base-filters.model';
import { BaseModel } from './common/base.model';
import { User } from './user.model';

export class UserPetition extends BaseModel<number> {
    public userSender?: User;
    public userReceiver?: User;
    public petitionStatus: number;
}

@Injectable({
    providedIn: 'root'
})
export class UserPetitionAdapter implements Adapter<UserPetition> {
    adapt(item: any): UserPetition {
        const userPetition = new UserPetition();
        userPetition.id = item.id;
        userPetition.userSender = item.userSender;
        userPetition.userReceiver = item.userReceiver;
        userPetition.petitionStatus = item.petitionStatus;

        return userPetition;
    }
}

@Injectable({
    providedIn: 'root'
})
export class FilteredUserPetitionAdapter implements Adapter<BaseFilters<UserPetition>> {
    adapt(object: BaseFilters<any>): BaseFilters<UserPetition> {
        const items = [];
        object.items.forEach(element => {
            var item = new UserPetition();
            item.id = element.id;
            item.userSender = element.userSender;
            item.userReceiver = element.userReceiver;
            item.petitionStatus = element.petitionStatus;   

            items.push(item);
        });

        object.items = items;
        return object;
    }
} 