import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink, Router } from '@angular/router';
import { FeathericonsModule } from '../../../icons/feathericons/feathericons.module';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ApiError } from '../../../core/services/api-response';
import { TwoFactors } from '../../../core/services/identity/models/twoFactors';
import { IdentityService } from '../../../core/services/identity/services/identityService';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [RouterLink, MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
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
        private fb: FormBuilder,
        private identityService: IdentityService,
        private http: HttpClient,
        private router: Router,
    ) {
      console.log('Before submission, showTwoFactor:', this.showTwoFactor);
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
        this.twoFactorForm = this.fb.group({
          twoFactorCode: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6), Validators.pattern('^[0-9]{6}$')]]
        });
    }

    onSubmit() {
        if (this.authForm.valid) {
          const formData = this.authForm.value;

          this.identityService.signIn(formData).subscribe(
            (data) => {
              console.log(data);
              if(data.token) 
              {
                localStorage.setItem('accessToken', data.token);
                this.router.navigate(['/']);
              }

              if(data.twoFactors) {
                this.email = this.authForm.value.email;
                this.password = this.authForm.value.password;
              }
            },
            (error: ApiError) => {
              if (error.validation) {
                this.errorMessage = `Validation failed: ${error.validation}`;
              } else if (error.message) {
                this.errorMessage = `Login failed: ${error.message}`;
              } else {
                this.errorMessage = 'An unknown error occurred.';
              }
            }
          );
      }
    }
    onSubmitTwoFactor() {
      // if (this.twoFactorForm.valid) {
      //   const code = this.twoFactorForm.value.twoFactorCode;
      //   console.log('Two-factor code:', code);
      //   console.log('Email:', this.email);
      //   console.log('Password:', this.password);

      //   const twoFactorCode = this.twoFactorForm.value.twoFactorCode;
  
      //   this.identityService.sendTwoFactor(this.email, this.password, 0, twoFactorCode).subscribe(
      //     (response) => {
      //       console.log('Two-factor authentication initiated:', response);
      //     },
      //     (error: ApiError) => {
      //       if (error.validation) {
      //         this.errorMessage = `Validation failed: ${error.validation}`;
      //       } else if (error.message) {
      //         this.errorMessage = `Login failed: ${error.message}`;
      //       } else {
      //         this.errorMessage = 'An unknown error occurred.';
      //       }
      //     }
      //   );
      // }
    }
}