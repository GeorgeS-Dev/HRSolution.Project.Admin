import { Component, Injector, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { FeathericonsModule } from '../../../../icons/feathericons/feathericons.module';
import {
    FormsModule,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
    AbstractControl,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { jwtTokenClaims } from '../../../../core/services/identity/models/jwtTokenClaims';
import { MatButton, MatIconButton } from '@angular/material/button';
import { TokenService } from '../../../../core/services/identity/services/token.service';
import { NgIf } from '@angular/common';
import { AuthService } from '../../../../core/services/identity/services/auth.service';

@Component({
    selector: 'app-user-details',
    standalone: true,
    imports: [
        MatButton,
        MatIconButton,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        FeathericonsModule,
        MatCheckboxModule,
        ReactiveFormsModule,
        NgIf,
        MatCardModule
    ],
    templateUrl: './user-details.component.html',
    styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
    hide: boolean = true;
    hidere: boolean = true;
    userClaims: jwtTokenClaims | null = null;
    profileForm: FormGroup;

    constructor(private injector: Injector, private fb: FormBuilder, private tokenService: TokenService, private authService: AuthService) {
        this.profileForm = this.fb.group({
            password: ['', 
                [Validators.required, 
                    Validators.minLength(8),
                    this.passwordValidator]
                ],
            repeatPassword: [
                '',
                [Validators.required,
                    Validators.minLength(8), 
                    this.passwordValidator],
            ],
        });

        this.authService.onLogin.subscribe(() => {
            this.loadUserClaims();
        });
    }

    ngOnInit(): void {
        this.loadUserClaims();
    }

    loadUserClaims(): void {
        const decodedToken = this.tokenService.getDecodedToken();
        if (decodedToken) {
            this.userClaims = decodedToken;
        }
    }

    passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
        const value = control.value;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
        return regex.test(value) ? null : { invalidPassword: true };
    }

    onSubmit() {
        if (this.profileForm.valid) {
        }
    }
}
