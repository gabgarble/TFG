import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/data-service/api.service';
import { ColorAdapter, FilteredColorAdapter, Color } from '../models';
import { BaseEntityService } from './base-entity.service';

const baseRoute: string = 'color/';

@Injectable({
    providedIn: 'root',
})
export class ColorService extends BaseEntityService<Color> {
    constructor(
        public apiService: ApiService,
        public colorAdapter: ColorAdapter,
        public filteredColorAdapter: FilteredColorAdapter) {
        super(apiService, colorAdapter, baseRoute);
    }
}