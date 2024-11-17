import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AlertService } from './alert.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private alertService: AlertService) {}

  get(url: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}${url}`).pipe(
      tap((response: any) => this.handleSuccess(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}${url}`, body).pipe(
      tap((response: any) => this.handleSuccess(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}${url}`, body).pipe(
      tap((response: any) => this.handleSuccess(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  patch(url: string, body: any): Observable<any> {
    return this.http.patch(`${environment.apiUrl}${url}`, body).pipe(
      tap((response: any) => this.handleSuccess(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  delete(url: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}${url}`).pipe(
      tap((response: any) => this.handleSuccess(response)),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleSuccess(response: any): void {
    if (response?.message) {
      this.alertService.showSuccess(response.message);
    }
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.alertService.showError(error.error.errorCodes);
    return throwError(error.error.errorCodes);
  }
}
