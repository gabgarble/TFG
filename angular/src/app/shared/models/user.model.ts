import { Injectable } from '@angular/core';
import { Adapter } from '../../core/adapter/adapter';
import { BaseModel } from './common/base.model';

export class User extends BaseModel<number> {
  public name?: string;
  public surname?: string;
  public username?: string;
  public email?: string;
  public password?: string;
}

export class SignIn {
  public email: string;
  public password: string;
}

export class SignUp {
  public username: string;
  public email: string;
  public password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserAdapter implements Adapter<User>
{
  adapt(item: any): User {
    const user = new User();
    user.id = item.id;
    user.name = item.name;
    user.surname = item.surname;
    user.email = item.email;
    user.password = item.password;

    return user;
  }
}
