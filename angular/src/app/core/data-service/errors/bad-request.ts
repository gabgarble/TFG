import { AppError } from './app-error';

export class BadRequest extends AppError {
    constructor(data: any) {
        super(data);
    }
}
