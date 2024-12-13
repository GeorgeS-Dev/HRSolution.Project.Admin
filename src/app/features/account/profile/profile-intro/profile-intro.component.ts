import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { jwtTokenClaims } from '../../../../core/services/identity/models/jwtTokenClaims';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TokenService } from '../../../../core/services/identity/services/token.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-profile-intro',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatTooltipModule, NgIf],
    templateUrl: './profile-intro.component.html',
    styleUrl: './profile-intro.component.scss'
})

export class ProfileIntroComponent {
userClaims: jwtTokenClaims;
TwoFAActive: boolean = false;

    constructor(
        private tokenService: TokenService) {
            this.userClaims = tokenService.getDecodedToken();
            this.TwoFAActive = this.userClaims.TwoFactorEnabled;
    }
}