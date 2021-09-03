import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../../models/app-settings/app-settings.model';
const jsonFile = 'assets/app-settings/app-settings.json';

@Injectable()
export class AppSettingsService {

    static settings: AppSettings;

    constructor(private http: HttpClient) { }

    public load() {
        const promise = this.http.get(jsonFile).toPromise();

        promise.then(
            (response: AppSettings) => AppSettingsService.settings = <AppSettings>response,
            error => console.error('Error al cargar el fichero de configuración: ', error)
        );

        return promise;
    }
}
