import { AppError } from './app-error';

export class NotFoundError extends AppError {
    constructor(data: any) {
        super(data);     
    }
}
