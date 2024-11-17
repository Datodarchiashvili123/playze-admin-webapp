import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  concatMap,
  filter,
  finalize,
  from,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<string | null> =
    new BehaviorSubject<string | null>(null);
  private cachedRequests: HttpRequest<any>[] = [];

  constructor(private _authService: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this._authService.accessToken();
    let authReq = req;

    if (token) {
      authReq = this.addTokenHeader(req, token);
    }

    return next.handle(authReq).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          error.status === 401 &&
          !req.url.includes('refresh-access-token')
        ) {
          return this.handle401Error(authReq, next);
        } else {
          return throwError(() => error);
        }
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers.set('Authorization', 'Bearer ' + token),
    });
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      this.cachedRequests.push(request);

      return this._authService.refreshAccessToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          const newToken = response.parameters.auth.accessToken;
          const newRefreshToken = response.parameters.auth.refreshToken;

          if (newToken) {
            this._authService.accessToken.set(newToken);
            this._authService.refreshToken.set(newRefreshToken);

            localStorage.setItem(
              this._authService.localStorageAccessTokenName,
              newToken
            );
            localStorage.setItem(
              this._authService.localStorageRefreshTokenName,
              newRefreshToken
            );

            this.refreshTokenSubject.next(newToken);

            return from(this.cachedRequests).pipe(
              take(1),
              concatMap((req) =>
                next.handle(this.addTokenHeader(req, newToken))
              ),
              finalize(() => {
                this.cachedRequests = [];
              })
            );
          } else {
            this._authService.signOut();
            this.router.navigateByUrl('sign-in');
            return throwError(() => new Error('No token returned'));
          }
        }),
        catchError((err) => {
          this.isRefreshing = false;
          this._authService.signOut();
          this.router.navigateByUrl('sign-in');
          return throwError(() => err);
        }),
        finalize(() => {
          this.isRefreshing = false;
        })
      );
    } else {
      this.cachedRequests.push(request);
      return this.refreshTokenSubject.pipe(
        filter((token) => token !== null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addTokenHeader(request, token as string));
        })
      );
    }
  }
}
