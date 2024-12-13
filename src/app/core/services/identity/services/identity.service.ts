import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../../api-response';
import { SignInResponse } from '../models/signInResponse';
import { parseIdentityResponse, parseIdentityResponseError } from '../../../helpers/identityResponseParser';
import { AuthService } from '../../auth.service';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly apiUrl = 'http://69.197.142.95:31301/api/v1/';

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {
  }

  signIn(credentials: any): Observable<SignInResponse> {
    return this.http.post<ApiResponse<SignInResponse>>(`${this.apiUrl}Account/SignIn`, credentials, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).pipe(
      map((response) => parseIdentityResponse<SignInResponse>(response)),
      catchError((error) => {
        const apiError = parseIdentityResponseError(error.error);
        return throwError(() => apiError);
      })
    );
  }

  sendTwoFactor(email: string, password: string, type: number, code: string): Observable<any> {
    const payload = {
      email: email,
      password: password,
      type: 0,
    };

    return this.http
      .post(`${this.apiUrl}Account/TwoFactorSend`, payload, {
        headers: {
          Accept: 'text/plain',
          'Content-Type': 'application/json',
        },
      })
      .pipe(
        catchError((error) => {
          const apiError = parseIdentityResponseError(error.error);
          return throwError(() => apiError);
        })
      );
  }
  
  twoFactorEnableSend(): Observable<string> {
    const headers = new HttpHeaders()
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.authService.getAccessToken()}`); // Add Authorization header
  
    const body = { type: 0 }; // Request body data
  
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}Profile/TwoFactorEnableSend`,
      body,
      { headers }
    ).pipe(
      map((response) => parseIdentityResponse<string>(response)),
      catchError((error) => {
        const apiError = parseIdentityResponseError(error.error);
        return throwError(() => apiError);
      })
    );
  }
  
  twoFactorEnableConfirm(code: string, type: number = 0): Observable<string> {
    const headers = new HttpHeaders()
      .set('Accept', 'text/plain')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${this.authService.getAccessToken()}`); // Add Authorization header
  
    const body = {
      code: code,
      type: 0,
    };
  
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}Profile/TwoFactorEnableConfirm`,
      body,
      { headers }
    ).pipe(
      map((response) => parseIdentityResponse<string>(response)),
      catchError((error) => {
        const apiError = parseIdentityResponseError(error.error);
        return throwError(() => apiError);
      })
    );
  }
  
}
