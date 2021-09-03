import { AppError } from './app-error';

export class Forbidden extends AppError {
    constructor(data: any) {
        super(data);     
    }
}
