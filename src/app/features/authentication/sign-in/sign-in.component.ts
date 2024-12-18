import { Component } from '@angular/core';
import {
    FormsModule,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { ApiError } from '../../../core/services/api-response';
import { TwoFactors } from '../../../core/services/identity/models/twoFactors';
import { IdentityService } from '../../../core/services/identity/services/identity.service';
import { AuthService } from '../../../core/services/auth.service';
import { jwtDecode } from 'jwt-decode';
import { jwtTokenClaims } from '../../../core/services/identity/models/jwtTokenClaims';
import { SignInResponse } from '../../../core/services/identity/models/signInResponse';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-sign-in',
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
        TranslateModule
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
    hide: boolean = true;
    showTwoFactor: boolean = false;
    errorMessage: string | null = null;
    twoFactorTypes: TwoFactors[] | null = null;
    authForm: FormGroup;
    twoFactorForm: FormGroup;
    email: string = '';
    password: string = '';

    constructor(
        public authService: AuthService,
        private fb: FormBuilder,
        private identityService: IdentityService,
        private router: Router,
        private translate: TranslateService
    ) {
        this.authForm = this.createAuthForm();
        this.twoFactorForm = this.createTwoFactorForm();
    }

    private createAuthForm(): FormGroup {
        return this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).+$')
            ]],
        });
    }

    private createTwoFactorForm(): FormGroup {
        return this.fb.group({
            twoFactorCode: [
                '',
                [
                    Validators.required,
                    Validators.minLength(6),
                    Validators.maxLength(6),
                    Validators.pattern('^[0-9]{6}$'),
                ],
            ],
        });
    }

    onSubmit() {
        if (this.authForm.valid) {
            const formData = this.authForm.value;
            this.errorMessage = "";
            this.identityService.signIn(formData).subscribe(
                (data: SignInResponse) => this.handleSignInResponse(data),
                (error: ApiError) => this.handleError(error)
            );
        }
    }

    private handleSignInResponse(data: SignInResponse) {
        if (data.accessToken) {
            this.authService.setAccessToken(data.accessToken);
            this.router.navigate(['/']);
        }

        if (data.twoFactors) {
            this.email = this.authForm.value.email;
            this.password = this.authForm.value.password;
            this.showTwoFactor = true;
        }
    }

    private handleError(error: ApiError) {
        if (error.validation) {
            this.setFormValidationErrors(error.validation);
            this.errorMessage = this.translate.instant('VALIDATION_FAILED');
        } else if (error.message) {
            this.errorMessage = this.translate.instant('LOGIN_FAILED', { message: error.message });
        } else {
            this.errorMessage = this.translate.instant('UNKNOWN_ERROR');
        }
    }

    private setFormValidationErrors(validationErrors: { [key: string]: string }) {
        Object.keys(validationErrors).forEach(key => {
            const control = this.authForm.get(key);
            if (control) {
                control.setErrors({ serverError: validationErrors[key] });
            }
        });
    }

    onSubmitTwoFactor() {
        if (this.twoFactorForm.valid) {
            const code = this.twoFactorForm.value.twoFactorCode;
            this.identityService.confirmTwoFactorSignIn(this.email, this.password, code).subscribe(
                (data: SignInResponse) => this.handleTwoFactorResponse(data),
                (error: ApiError) => this.handleTwoFactorError(error)
            );
        }
    }

    private handleTwoFactorResponse(data: SignInResponse) {
        if (data.accessToken) {
            this.authService.setAccessToken(data.accessToken);
            this.router.navigate(['/']);
        }
    }

    private handleTwoFactorError(error: ApiError) {
        this.showTwoFactor = false;
        this.handleError(error);
    }
}
