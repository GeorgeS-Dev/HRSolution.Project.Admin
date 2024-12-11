import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response';
import { SignInResponse } from './models/signInResponse';
import { parseIdentityResponse, parseIdentityResponseError } from '../../helpers/identityresponseparser';

@Injectable({
  providedIn: 'root',
})
export class IdentityService {
  private readonly apiUrl = 'http://69.197.142.95:31301/api/v1/';

  constructor(private http: HttpClient) {}

  signIn(credentials: any): Observable<SignInResponse> {
    return this.http.post<ApiResponse<SignInResponse>>(`${this.apiUrl}Account/SignIn`, credentials, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }).pipe(
      map((response) => parseIdentityResponse<SignInResponse>(response)),
      catchError((error) => {
        const apiError = parseIdentityResponseError(error.error); // Parse error
        return throwError(() => apiError); // Return parsed error
      })
    );
  }

  sendTwoFactor(email: string, password: string, type: number, code: string): Observable<any> {
    const payload = {
      email: email,
      password: password,
      type: 0, // Assuming 'type' remains constant
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
}
