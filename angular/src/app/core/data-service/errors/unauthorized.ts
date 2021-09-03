import { AppError } from './app-error';

export class Unauthorized extends AppError {
    constructor(data: any) {
        super(data);     
    }
}
