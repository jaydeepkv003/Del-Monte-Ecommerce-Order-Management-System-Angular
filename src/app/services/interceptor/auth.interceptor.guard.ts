import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { FixedRoutes } from '@urls';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {
  constructor(public router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    request = request.clone({
      headers: request.headers.set(
        'SetPassword',
        `${window.location.origin}/${FixedRoutes.SetPassword}?code=`
      ),
    });
    request = request.clone({
      headers: request.headers.set(
        'Download',
        `${window.location.origin}/${FixedRoutes.Download}?code=`
      ),
    });

    const token = localStorage.AccessToken;
    if (token) {
      request = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`),
      });
    }
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          localStorage.clear();
          this.router.navigateByUrl('');
        }
        const error = (err && err.error && err.error.message) || err.statusText;
        return throwError(error);
      })
    );
  }
}
