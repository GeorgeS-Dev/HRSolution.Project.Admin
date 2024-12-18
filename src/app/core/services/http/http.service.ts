import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { ApiResponse } from '../api-response';
import { parseIdentityResponse, parseIdentityResponseError } from '../../helpers/identityResponseParser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignInResponse } from '../identity/models/signInResponse';

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

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  httpPost<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body, { headers }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  httpGet<T>(url: string, headers: HttpHeaders, params?: any): Observable<T> {
    return this.http.get<ApiResponse<T>>(url, { headers, params }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  httpPut<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http.put<ApiResponse<T>>(url, body, { headers }).pipe(
      map((response) => this.parseResponse<T>(response)),
      catchError((error) => this.handleError(error))
    );
  }

  httpDelete<T>(url: string, headers: HttpHeaders): Observable<T> {
    return this.http.delete<ApiResponse<T>>(url, { headers }).pipe(
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
                return throwError(err);
              })
            );
          } else {
            this.isRefreshing = false;
            this.removeToken();
            return throwError(error);
          }
        }
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

  private parseResponse<T>(response: ApiResponse<T>): T {
    return parseIdentityResponse<T>(response);
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

  private refreshToken(refreshToken: string): Observable<SignInResponse> {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
    const body = { refreshToken };
    return this.http.post<SignInResponse>('/api/refresh-token', body, { headers });
  }
}
