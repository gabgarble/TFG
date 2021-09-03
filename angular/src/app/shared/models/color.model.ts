import { Injectable } from '@angular/core';
import { Adapter } from '../../core/adapter/adapter';
import { BaseFilters } from './common/base-filters.model';
import { BaseModel } from './common/base.model';

export class Color extends BaseModel<number> {
    public description: string;
    public primaryColor: string;
    public secondaryColor: string;
}

@Injectable({
    providedIn: 'root'
})
export class ColorAdapter implements Adapter<Color> {
    adapt(item: any): Color {
        const color = new Color();
        color.id = item.id;
        color.description = item.description;
        color.primaryColor = item.primaryColor;
        color.secondaryColor = item.secondaryColor;

        return color;
    }
}

@Injectable({
    providedIn: 'root'
})
export class FilteredColorAdapter implements Adapter<BaseFilters<Color>> {
    adapt(object: BaseFilters<any>): BaseFilters<Color> {
        const items = [];
        object.items.forEach(element => {
            var item = new Color();
            item.id = element.id;
            item.description = element.description;
            item.primaryColor = element.primaryColor;
            item.secondaryColor = element.secondaryColor;   

            items.push(item);
        });

        object.items = items;
        return object;
    }
} 