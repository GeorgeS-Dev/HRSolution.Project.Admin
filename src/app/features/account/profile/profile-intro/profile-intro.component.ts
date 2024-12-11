import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { IdentityService } from '../../../../core/services/identity/services/identityService';
import { jwtTokenClaims } from '../../../../core/services/identity/models/jwtTokenClaims';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-profile-intro',
    standalone: true,
    imports: [RouterLink, MatCardModule, MatButtonModule, MatTooltipModule],
    templateUrl: './profile-intro.component.html',
    styleUrl: './profile-intro.component.scss'
})

export class ProfileIntroComponent {
userClaims: jwtTokenClaims | null;

    constructor(
        private identityService: IdentityService) {
            this.userClaims = identityService.getDecodedToken();
    }
}