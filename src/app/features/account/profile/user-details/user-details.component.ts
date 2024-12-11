import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelect } from '@angular/material/select';
import { jwtTokenClaims } from '../../../../core/services/identity/models/jwtTokenClaims';
import { IdentityService } from '../../../../core/services/identity/services/identityService';
import { MatIconButton } from '@angular/material/button';

@Component({
    selector: 'app-user-details',
    standalone: true,
    imports: [RouterLink, MatCardModule, FeathericonsModule, FormsModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelect, MatIconButton],
    templateUrl: './user-details.component.html',
    styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent {
    hide: boolean = true;
    hidere: boolean = true;
    userClaims: jwtTokenClaims | null;
    
        constructor(
            private identityService: IdentityService) {
                this.userClaims = identityService.getDecodedToken();
        }
    }