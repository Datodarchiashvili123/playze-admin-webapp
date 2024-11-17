import { computed, Injectable, signal } from '@angular/core';
import { AuthModel } from '../models/auth.model';
import { Observable, of, tap, throwError } from 'rxjs';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessToken = signal<string>('');
  public refreshToken = signal<string>('');
  public roles = signal<string[]>([]);
  public fullName = signal<string>('');
  public email = signal<string>('');

  public readonly localStorageAccessTokenName = 'accessToken';
  public readonly localStorageRolesName = 'roles';
  public readonly localStorageRefreshTokenName = 'refreshToken';
  public readonly localStorageFullName = 'fullname';
  public readonly localStorageEmail = 'email';

  public isAuthenticated = computed(() => this.accessToken()?.length > 0);

  private readonly _apiUrl = `/auth`;

  constructor(private readonly _http: HttpService) {
    this.initSignals();
  }

  authorize(model: AuthModel): Observable<any> {
    if (this.isAuthenticated())
      return throwError(() => new Error('User is already authenticated'));

    return this._http.post(`${this._apiUrl}`, model).pipe(
      tap((x: any) => {
        this.storeTokensAndPermissions(x.parameters, x.key);
      })
    );
  }

  signOut(): Observable<any> {
    localStorage.removeItem(this.localStorageAccessTokenName);
    localStorage.removeItem(this.localStorageRolesName);
    localStorage.removeItem(this.localStorageRefreshTokenName);
    localStorage.removeItem(this.localStorageFullName);
    localStorage.removeItem(this.localStorageEmail);

    this.accessToken.set('');
    this.roles.set([]);
    this.refreshToken.set('');
    this.fullName.set('');
    this.email.set('');

    return of(true);
  }

  public hasPermission(role: string): boolean {
    return this.roles().includes(role);
  }

  refreshAccessToken(): Observable<any> {
    return this._http
      .post(`${this._apiUrl}/refresh-access-token`, {
        accessToken: this.accessToken(),
        refreshToken: this.refreshToken(),
      })
      .pipe(
        tap((x: any) => {
          this.storeTokensAndPermissions(x.parameters, x.key);
        })
      );
  }

  private storeTokensAndPermissions(parameters: any, key: any) {
    const model = parameters[key];

    localStorage.setItem(this.localStorageAccessTokenName, model.accessToken);
    this.accessToken.set(model.accessToken);

    localStorage.setItem(this.localStorageRefreshTokenName, model.refreshToken);
    this.refreshToken.set(model.refreshToken);

    localStorage.setItem(
      this.localStorageRolesName,
      JSON.stringify(model.roles)
    );

    this.roles.set(model.roles);

    localStorage.setItem(this.localStorageFullName, model.fullName);
    this.fullName.set(model.fullName);

    localStorage.setItem(this.localStorageEmail, model.email);
    this.email.set(model.email);
  }

  private initSignals() {
    const localAccessToken = localStorage.getItem(
      this.localStorageAccessTokenName
    );
    if (localAccessToken) {
      this.accessToken.set(localAccessToken);
    }

    const localRefreshToken = localStorage.getItem(
      this.localStorageRefreshTokenName
    );
    if (localRefreshToken) {
      this.refreshToken.set(localRefreshToken);
    }

    const localRoles = localStorage.getItem(this.localStorageRolesName);
    if (localRoles) {
      this.roles.set(JSON.parse(localRoles));
    }

    const fullName = localStorage.getItem(this.localStorageFullName);
    if (fullName) {
      this.fullName.set(fullName);
    }

    const email = localStorage.getItem(this.localStorageEmail);
    if (email) {
      this.email.set(email);
    }
  }
}
