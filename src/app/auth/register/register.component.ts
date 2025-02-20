import { Component, OnInit, } from '@angular/core';
import {
  AbstractControl,
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  FormGroup,
  UntypedFormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import Validation from '../common-validators';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
declare var bootstrap: any;



@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})


export class RegisterComponent implements OnInit {
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showPasswordtwo: boolean = false;
  isLoading = false;
  showOtpField = false;
  emailExistsError: any
  resendDisabled = true;
  isEmailValid = false;
  countdownMinutes: number = 10;
  countdownSeconds: number = 0;
  timerActive: boolean = true;
  countdownInterval: any;
  form: UntypedFormGroup = new UntypedFormGroup({
    firstname: new UntypedFormControl(''),
    lastname: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
    confirmPassword: new UntypedFormControl(''),
    mobileno: new UntypedFormControl('')
  });
  submitted = false;
  otpForm!: FormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = this.formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(20),
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&0-9].{7,20}'

            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
        mobileno: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]]
      },
      {
        validators: [Validation.match('password', 'confirmPassword')],
      }
    );

    this.otpForm = this.formBuilder.group({
      otp: ['', [Validators.required,]],
    });
  }

  get formControl(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  get otpFormControl(): { [key: string]: AbstractControl } {
    return this.otpForm.controls;
  }



  onEmailInput() {
    const emailControl = this.form.get('email');
    this.isEmailValid = emailControl?.valid || false;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      console.log('Form is invalid');
      return;
    }

    this.isLoading = true;
    const { firstname, lastname, email, password, mobileno } = this.form.value;

    // Store user data temporarily before OTP verification
    this.authService.setUserData({ firstname, lastname, email, password, mobileno });
    this.authService.sendOtp(email).subscribe({
      next: () => {
        this.isLoading = false;
        this.emailExistsError = ''; // Clear previous error message

        Swal.fire({
          icon: 'success',
          title: 'OTP sent to your email!',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        });

        // Show OTP field after success
        this.showOtpField = true;
        this.startCountdown()
      },
      error: (err) => {
        this.isLoading = false;

        if (err.error.message === 'Email is already registered.') {
          this.emailExistsError = 'Email is already registered. Please log in instead.';
        } else if (err.error.message === 'Email is registered, wait for approval.') {
          this.emailExistsError = 'Your registration is pending approval. Please wait for confirmation.';
        } else {
          this.emailExistsError = ''; // Reset for other errors
          Swal.fire({
            icon: 'error',
            title: 'Error sending OTP',
            timer: 3000,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
          });
        }
      }
    });

  }

  startCountdown() {
    this.countdownMinutes = 5;
    this.countdownSeconds = 0;
    this.timerActive = true;

    this.countdownInterval = setInterval(() => {
      if (this.countdownSeconds === 0) {
        if (this.countdownMinutes === 0) {
          clearInterval(this.countdownInterval);
          this.timerActive = false;
          return;
        }
        this.countdownMinutes--;
        this.countdownSeconds = 59;
      } else {
        this.countdownSeconds--;
      }
    }, 1000);
  }



  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  togglePasswordVisibilitytwo() {
    this.showPasswordtwo = !this.showPasswordtwo;
  }




  resendOtp() {
    this.authService.resendOtp(this.form.value.email).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'New OTP sent!',
          text: 'Check your email. The OTP is valid for 10 minutes.',
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        });

        this.startCountdown(); // Restart countdown timer
      },
      error: (err: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error resending OTP',
          text: err.error.message,
          timer: 3000,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
        });
      }
    })
  }


  verifyOtp() {
    if (this.otpForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Please enter a valid OTP',
        timer: 3000,
      });
      return;
    }

    // Extract user details from form
    const userData = {
      firstName: this.form.value.firstname,
      lastName: this.form.value.lastname,
      email: this.form.value.email,
      mobileno: this.form.value.mobileno,
      password: this.form.value.password,
      confirmPassword: this.form.value.confirmPassword,
      otp: this.otpForm.value.otp, // Extract OTP from otpForm
    };

    this.authService.verifyOtpAndRegister(userData).subscribe({
      next: (res: any) => {
        console.log("response after verification", res);

        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: "Awaiting admin approval. You'll be notified via email once confirmed.",
          confirmButtonText: 'OK', // Adds an OK button
        });

        // Optional, if needed
        this.router.navigate(['/login']); // Redirect to login page
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: error.error.message || 'Invalid OTP. Please try again.',
          timer: 3000,
        });
      },
    });
  }


}




// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-register',
//   imports: [],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.css'
// })
// export class RegisterComponent {

// }
