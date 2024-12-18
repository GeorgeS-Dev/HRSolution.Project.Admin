import { Injectable } from '@angular/core';
import { jwtTokenClaims } from '../models/jwtTokenClaims';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenKey = 'authToken';
  private accessToken: string | null = null;
  private decodedJWT: jwtTokenClaims | null = null;

  constructor() {
    this.accessToken = this.getToken();
    if (this.accessToken) {
      try {
        this.decodedJWT = jwtDecode<jwtTokenClaims>(this.accessToken);
      } catch (error) {
        console.error('Invalid token specified:', error);
        this.removeToken();
      }
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.accessToken = token;
    try {
      this.decodedJWT = jwtDecode<jwtTokenClaims>(token);
    } catch (error) {
      console.error('Invalid token specified:', error);
      this.removeToken();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    this.accessToken = null;
    this.decodedJWT = null;
  }

  isValidToken(token: string): boolean {
    // Add your token validation logic here
    return !!token;
  }

  getDecodedToken(): jwtTokenClaims | null {
    return this.decodedJWT;
  }

  getFirstName(): string | null {
    return this.decodedJWT ? this.decodedJWT.FirstName : null;
  }

  getId(): string | null {
    return this.decodedJWT ? this.decodedJWT.UserID : null;
  }

  getRole(): string | null {
    return this.decodedJWT ? this.decodedJWT.role : null;
  }
}