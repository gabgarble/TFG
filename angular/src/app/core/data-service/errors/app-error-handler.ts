import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AppErrorHandler extends ErrorHandler {

    private router: Router;

    constructor(injector: Injector) {
        setTimeout(() => this.router = injector.get(Router));
        super();
    }

    handleError(error) {
        console.log('Error: ', error);

        super.handleError(error);
    }
}
