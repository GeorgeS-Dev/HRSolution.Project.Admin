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

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [RouterLink, MatButton, MatIconButton, FormsModule, MatFormFieldModule, MatInputModule, FeathericonsModule, MatCheckboxModule, ReactiveFormsModule, NgIf],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private router: Router,
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    // Password Hide
    hide = true;

    // Form
    authForm: FormGroup;
    onSubmit() {
        if (this.authForm.valid) {
          const formData = this.authForm.value;
          const apiUrl = 'http://69.197.142.95:31301/api/v1/Account/SignIn';
      
          this.http.post(apiUrl, formData, {
            headers: {
              'Accept': 'text/plain',
              'Content-Type': 'application/json'
            }
          }).subscribe(
            (response: any) => {
              // Handle success response
              if (response && response.data.token) {
                // Store the token in localStorage or sessionStorage
                localStorage.setItem('accessToken', response.data.token);  // or sessionStorage.setItem('accessToken', response.token);
      
                console.log('Login successful, token stored:', response.data.token);
                this.router.navigate(['/']); // Redirect after successful login
              } else {
                console.log('Token not found in response');
              }
            },
            (error) => {
              // Handle error response
              console.log('Login failed:', error);
            }
          );
        } else {
          console.log('Form is invalid. Please check the fields.');
        }
      }      
}