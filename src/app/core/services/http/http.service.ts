import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response';
import { parseIdentityResponse, parseIdentityResponseError } from '../../helpers/identityResponseParser';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

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

  private parseResponse<T>(response: ApiResponse<T>): T {
    return parseIdentityResponse<T>(response);
  }

  private handleError(error: any): Observable<never> {
    const apiError = parseIdentityResponseError(error.error, this.snackBar);
    return throwError(() => apiError);
  }
}
