import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';




@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  password: string = '';
  showPassword: boolean = false;

  isLoggedIn = false;
  LogoPath!: string;
  errMessage: string = '';
  form: UntypedFormGroup = new UntypedFormGroup({
    email: new UntypedFormControl(''),
    password: new UntypedFormControl(''),
  });
  submitted = false;
  isLoading = false;
  toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    customClass: { popup: 'swal-wide' },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });
  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.isLoading = false;
  }

  buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ],
      ],
    });
  }

  //getter to access form controls
  get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  signIn(): void {
    this.submitted = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    const { email, password } = this.form.value;
    this.authService.signIn(email, password).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.storageService.setToken(data.token);
        this.storageService.setRole(
          JSON.parse(atob(data.token.split('.')[1])).type
        );
        this.storageService.setStorage(
          JSON.parse(atob(data.token.split('.')[1])).storage
        );
        this.isLoggedIn = true;

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { popup: 'swal-wide' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'success',
          title: 'Signed in successfully',
        });

        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.status === 404) {
          this.errMessage = 'Email or password not found';
        } else if (err.status === 401) {
          this.errMessage = err.error.message;
        } else {
          this.errMessage = 'Error logging in';
        }


        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { popup: 'swal-wide' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title: this.errMessage,
        });
      },
    });
  }

  onReset(): void {
    this.submitted = false;
    this.form.reset();
  }

  togglePasswordVisibility() {
    console.log('Before Toggle:', this.showPassword);
    this.showPassword = !this.showPassword;
    console.log('After Toggle:', this.showPassword);

  }

}


// import { Component } from '@angular/core';
// import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import Swal from 'sweetalert2';
// import {AuthService} from 'src/app/service/auth.service';


// @Component({
//   selector: 'app-login',
//   imports: [],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.css'
// })
// export class LoginComponent {

// }
