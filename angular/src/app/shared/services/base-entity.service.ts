import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Adapter } from '../../core/adapter/adapter';
import { ApiService } from '../../core/data-service/api.service';

@Injectable()
export abstract class BaseEntityService<T> {

    private route: string;

    constructor(
        protected apiService: ApiService,
        protected adapter: Adapter<T>,
        protected baseRoute: string) {
        this.route = baseRoute;
    }

    public getAll(): Observable<T[]> {
        return this.apiService.get(this.route)
            .pipe(
                map(data => data.items.map(item => item ? this.adapter.adapt(item) : item))
            );
    }

    public getById(id: any): Observable<T> {
        return this.apiService.get(this.route + id)
            .pipe(
                map((data: T) => data ? this.adapter.adapt(data) : data)
            );
    }

    public update(type: T): Observable<T> {
        return this.apiService.put(this.route, type);
    }

    public add(type: T): Observable<T> {
        return this.apiService.post(this.route, type);
    }

    public deleteById(id: any): Observable<T> {
        return this.apiService.delete(this.route + id);
    }

}
