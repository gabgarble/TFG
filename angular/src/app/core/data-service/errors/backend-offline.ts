import { AppError } from './app-error';

export class BackendOffline extends AppError {
    constructor(data: any) {
        super(data);
    }
}

