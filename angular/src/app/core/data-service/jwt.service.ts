import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JwtService {

  public getToken(): String {
    return window.localStorage['jwtToken'];
  }

  public saveToken(token: String) {
    window.localStorage['jwtToken'] = token;
  }

  public destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }
}