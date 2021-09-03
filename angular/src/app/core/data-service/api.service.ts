import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppSettingsService } from '../../shared/services/app-settings/app-settings.service';
import { AppError } from './errors/app-error';
import { BackendOffline, BadRequest, Forbidden, InternalServerError, NotFoundError, Unauthorized } from './errors/index';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private translateService: TranslateService) { }

  private setHeaders(): HttpHeaders {
    const headersConfig = {
      /*'Content-Type': ' application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-store, no-cache'*/
    };

    /*if (this.jwtService.getToken()) {
      headersConfig['Authorization'] = `Bearer ${this.jwtService.getToken()}`;
    }*/

    return new HttpHeaders(headersConfig);
  }

  private formatErrors(response: HttpErrorResponse | any) {
    const applicationError = response.headers.get('Application-Error');

    if (applicationError) {
      return throwError(applicationError);
    }

    switch (response.status) {
      case 0:
        return throwError(new BackendOffline(this.translateService.instant('common.messages.error.backendOffline')));
      case 400:
        return throwError(new BadRequest(response));
      case 401:
        return throwError(new Unauthorized(response));
      case 403:
        return throwError(new Forbidden(response));
      case 404:
        return throwError(new NotFoundError(response));
      case 500:
        return throwError(new InternalServerError(response));
      default:
        return throwError(new AppError(response));
    }
  }

  get(path: string, params: any = new HttpParams()): Observable<any> {
    return this.http.get(`${AppSettingsService.settings.apiUrl}${path}`, { headers: this.setHeaders(), params: params })
      .pipe(
        map((res: Object) => res),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      );
  }

  put(path: string, body: Object = {}): Observable<any> {
    return this.http.put(`${AppSettingsService.settings.apiUrl}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
      .pipe(
        map((res: Object) => res),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      );
  }

  post(path: string, body: Object = {}): Observable<any> {
    return this.http.post(`${AppSettingsService.settings.apiUrl}${path}`, JSON.stringify(body), { headers: this.setHeaders() })
      .pipe(
        map((res: Object) => res),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      );
  }

  delete(path): Observable<any> {
    return this.http.delete(`${AppSettingsService.settings.apiUrl}${path}`, { headers: this.setHeaders() })
      .pipe(
        map((res: Object) => res),
        catchError((error: HttpErrorResponse) => this.formatErrors(error))
      );
  }
}
