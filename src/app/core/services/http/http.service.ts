import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { parseIdentityResponse, parseIdentityResponseError } from '../../helpers/apiResponseParser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInResponse } from '../identity/models/signInResponse';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly apiUrl = environment.identityServiceApiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  httpPost<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http.post<any>(url, body, { headers }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  httpGet<T>(url: string, headers: HttpHeaders, params?: any): Observable<T> {
    return this.http.get<any>(url, { headers, params }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  httpPut<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http.put<any>(url, body, { headers }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  httpDelete<T>(url: string, headers: HttpHeaders): Observable<T> {
    return this.http.delete<any>(url, { headers }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  private parseResponse<T>(response: any): T {
    if (response && response.status === 200 && !response.data) {
      return {} as T;
    }
    if (response && response.data) {
      return parseIdentityResponse<T>(response);
    }
    return response as T;
  }

  private handleError(error: any): Observable<never> {
    const apiError = parseIdentityResponseError(error.error, this.snackBar);
    return throwError(() => apiError);
  }
  
  refreshToken(refreshToken: string): Observable<SignInResponse> {
    const headers = new HttpHeaders({
        Accept: 'text/plain',
        'Content-Type': 'application/json',
    });
    const body = { refreshToken };
    return this.http.post<SignInResponse>(`${this.apiUrl}Account/RefreshToken`, body, { headers });
  }
}