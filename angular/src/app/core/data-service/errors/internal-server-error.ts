import { AppError } from './app-error';

export class InternalServerError extends AppError {
    constructor(data: any) {
        super(data);     
    }
}
