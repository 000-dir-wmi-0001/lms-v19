import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  selector: 'app-reset-password',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css'],
})
export class ResetPasswordComponent {
  resetPasswordForm: UntypedFormGroup;
  token: string = '';

  showPassword: boolean = false;
  showPasswordtwo: boolean = false;
  issubmitted: boolean = false;
  isLoading: boolean = false;

  constructor(
    private authservice: AuthService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Initialize the reactive form with form controls
    this.resetPasswordForm = this.formBuilder.group(
      {
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(8), // At least 8 characters
            Validators.pattern(
              /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~])[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~]{8,}$/
            ), // Contains at least 1 special character
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator, // Custom validator for password match
      }
    );
  }
  ngOnInit(): void {

    this.isLoading = false;
    this.route.params.subscribe((params: Params) => {
      this.token = params['resetToken'];
      console.log(this.token);
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(group: UntypedFormGroup) {
    const passwordControl = group.get('newPassword');
    const confirmPasswordControl = group.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      const password = passwordControl.value;
      const confirmPassword = confirmPasswordControl.value;
      if (password !== confirmPassword) {
        return { passwordMismatch: true };
      }
    }
    return null;
  }

  resetPassword() {

    this.isLoading = true;
    this.issubmitted = true;
    if (this.resetPasswordForm.invalid) {
      return;
    }

    const token = this.token;
    const password = this.resetPasswordForm.value.newPassword;
    this.authservice.resetPassword(token, password).subscribe(
      (response: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 6000,
          timerProgressBar: true,
          customClass: { popup: 'swal-wide' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'New password set successfully.',
        });

        this.router.navigate(['login']);
      },
      (error: any) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 10000,
          timerProgressBar: true,
          customClass: { popup: 'swal-wide' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title:
            'It looks like you clicked on an invalid password reset link. Please try again.',
        });
        this.router.navigate(['password_reset']);
      }
    );
  }
  resetForm() {
    this.resetPasswordForm.reset();
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibilitytwo() {
    this.showPasswordtwo = !this.showPasswordtwo;
  }
}
