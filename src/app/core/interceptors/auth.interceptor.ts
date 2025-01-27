import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  finalize,
  from,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<string | null>(null);
let refreshTokenRequest: Observable<any> | null = null;

export function AuthInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.accessToken();
  let authReq = req;

  if (token) {
    authReq = addTokenHeader(req, token);
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !req.url.includes('refresh-access-token')
      ) {
        return handleTokenRefresh(authService, router).pipe(
          switchMap((newToken) => {
            if (newToken) {
              return next(addTokenHeader(authReq, newToken));
            } else {
              authService.signOut();
              router.navigateByUrl('/sign-in');
              return throwError(() => new Error('Token refresh failed'));
            }
          })
        );
      }
      return throwError(() => error);
    })
  );
}

function addTokenHeader(request: HttpRequest<any>, token: string) {
  return request.clone({
    headers: request.headers.set('Authorization', 'Bearer ' + token),
  });
}

function handleTokenRefresh(
  authService: AuthService,
  router: Router
): Observable<string | null> {
  if (!refreshTokenRequest) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    refreshTokenRequest = authService.refreshAccessToken().pipe(
      switchMap((response: any) => {
        const newToken = response.parameters['auth'].accessToken;

        if (newToken) {
          refreshTokenSubject.next(newToken);
          return of(newToken);
        }

        return of(null);
      }),
      catchError((error) => {
        authService.signOut();
        router.navigateByUrl('/sign-in');
        return of(null);
      }),
      finalize(() => {
        isRefreshing = false;
        refreshTokenRequest = null;
      }),
      shareReplay(1)
    );
  }

  return refreshTokenRequest;
}
