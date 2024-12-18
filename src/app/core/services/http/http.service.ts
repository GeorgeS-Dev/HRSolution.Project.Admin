import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApiResponse } from '../api-response';
import { parseIdentityResponse, parseIdentityResponseError } from '../../helpers/apiResponseParser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInResponse } from '../identity/models/signInResponse';
import { IdentityService } from '../identity/services/identity.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly ACCESS_TOKEN_EXPIRES_KEY = 'accessTokenExpires';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly REFRESH_TOKEN_EXPIRES_KEY = 'refreshTokenExpires';
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private readonly apiUrl = environment.identityServiceApiUrl;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router
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

  interceptRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(this.addTokenHeader(request)).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 && !this.isRefreshing) {
          this.isRefreshing = true;
          const refreshToken = this.getRefreshToken();
          if (refreshToken) {
            return this.refreshToken(refreshToken).pipe(
              switchMap((data: SignInResponse) => {
                this.setToken(data.accessToken, data.accessTokenExpires, data.refreshToken, data.refreshTokenExpires);
                this.refreshTokenSubject.next(data.accessToken);
                this.isRefreshing = false;
                return next.handle(this.addTokenHeader(request));
              }),
              catchError((err) => {
                this.isRefreshing = false;
                this.removeToken();
                this.router.navigate(['/auth/login']);
                return throwError(err);
              })
            );
          } else {
            this.isRefreshing = false;
            this.removeToken();
            this.router.navigate(['/auth/login']);
          }
        }
        this.router.navigate(['/auth/login']);
        return throwError(error);
      })
    );
  }

  private addTokenHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = this.getToken();
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
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

  setToken(accessToken: string = "", accessTokenExpires: Date = new Date(), refreshToken: string = "", refreshTokenExpires: Date = new Date()): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.ACCESS_TOKEN_EXPIRES_KEY, accessTokenExpires.toString());
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(this.REFRESH_TOKEN_EXPIRES_KEY, refreshTokenExpires.toString());
}

  private getToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  private removeToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
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