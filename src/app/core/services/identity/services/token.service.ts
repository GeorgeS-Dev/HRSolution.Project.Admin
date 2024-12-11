import { jwtDecode } from 'jwt-decode';
import { jwtTokenClaims } from '../models/jwtTokenClaims';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
  })
export class TokenService {
    accessToken = localStorage.getItem('accessToken') ?? "";
    decodedJWT = jwtDecode<jwtTokenClaims>(this.accessToken);
  
    getDecodedToken(): jwtTokenClaims {
      console.log(this.decodedJWT);
      return this.decodedJWT;
    }
}