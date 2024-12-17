import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiResponse } from '../api-response';
import { parseIdentityResponse, parseIdentityResponseError } from '../../helpers/identityresponseparser';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor(private http: HttpClient) {}

  httpPost<T>(url: string, body: any, headers: HttpHeaders): Observable<T> {
    return this.http.post<ApiResponse<T>>(url, body, { headers }).pipe(
      map((response) => parseIdentityResponse<T>(response)),
      catchError((error) => {
        const apiError = parseIdentityResponseError(error.error);
        return throwError(() => apiError);
      })
    );
  }
}
