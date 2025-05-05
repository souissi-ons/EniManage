import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CorsInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    // For OPTIONS requests (preflight)
    if (request.method === 'OPTIONS') {
      return next.handle(
        request.clone({
          headers: request.headers.set('Access-Control-Allow-Origin', '*'),
        })
      );
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // You can modify response headers here if needed
        }
      })
    );
  }
}
