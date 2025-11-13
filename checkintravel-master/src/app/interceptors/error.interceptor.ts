import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthService,
        private logger : NGXLogger) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.logger.debug('HTTPErrorInterceptor: received 401 logging user out')
            //if (err.status !== 200) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload(true);
            }

            this.logger.debug('HTTPErrorInterceptor: received '+ err.status + ' : ' + err.error.message ||err.statusText )
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}