import { Component } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.component.html',
  styleUrls: ['./forgot-pass.component.css'],
})
export class ForgotPassComponent {
  forgotPasswordForm: UntypedFormGroup;
  issubmitted: boolean = false;

  errorMessage: string;
  isLoading: boolean;
  successMessage: boolean;

  constructor(
    private authService: AuthService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.errorMessage = '';
    this.successMessage = false;
    this.isLoading = false;

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Added Validators.required and Validators.email
    });
  }

  onSubmit() {
    this.issubmitted = true;
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true; // Show loading indicator
    const email = this.forgotPasswordForm.value.email;

    this.authService.forgotPassword(email).subscribe(
      (response: any) => {
        this.isLoading = false; // Hide loading indicator
        this.successMessage = true;
      },
      (error: any) => {
        this.isLoading = false; // Hide loading indicator
        this.successMessage = false;

        if (error.status === 404) {
          this.errorMessage =
            'Invalid email address. No user found with given email address';
        }
        else if (error.status === 403) {
          this.errorMessage =
            'Not verified user';
        }
        else {
          this.errorMessage = 'An error occurred. Please try again later.';
        }
      }
    );
  }
}