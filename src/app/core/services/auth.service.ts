import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'accessToken';

  constructor() {}

  // Check if the access token exists
  hasAccessToken(): boolean {
    const token = localStorage.getItem(this.ACCESS_TOKEN_KEY);
    return token !== null && token.trim().length > 0;
  }

  // Set the access token
  setAccessToken(token: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, token);
  }

  // Get the access token
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  // Remove the access token
  clearAccessToken(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
  }
}