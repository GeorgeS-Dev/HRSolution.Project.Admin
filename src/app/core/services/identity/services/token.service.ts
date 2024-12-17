import { jwtDecode } from 'jwt-decode';
import { jwtTokenClaims } from '../models/jwtTokenClaims';
import { Injectable, Injector } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TokenService {
    private accessToken: string;
    private decodedJWT: jwtTokenClaims;

    constructor(private injector: Injector) {
        this.accessToken = localStorage.getItem('accessToken') ?? "";
        this.decodedJWT = jwtDecode<jwtTokenClaims>(this.accessToken);
    }

    getDecodedToken(): jwtTokenClaims {
        return this.decodedJWT;
    }

    getFirstName(): string {
        return this.decodedJWT.FirstName;
    }

    getId(): string {
        return this.decodedJWT.UserID;
    }

    getRole(): string {
        return this.decodedJWT.role;
    }
}