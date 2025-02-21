import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { AlumniService } from '../../../services/alumni.service';
import { Alumni } from '../../../services/alumni.service'; // Import the Alumni interface

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
@Component({
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-alumni-register',
  templateUrl: './alumni-register.component.html',
  styleUrls: ['./alumni-register.component.css']
})
export class AlumniRegisterComponent {

  alumni: Alumni = {
    firstName: '',
    lastName: '',
    mobileNumber: '',
    skills: '',
    passoutYear: null,
    company: '',
    jobTitle: '',
    experience: '',
    createdAt: new Date(),
  };

  mobileNumberError: string | null = null;
  experienceError: string | null = null;
  loading: boolean = false;

  // Calculate the maximum date as today
  maxDate: Date = new Date();

  constructor(private alumniService: AlumniService) { }

  onDateChange() {
    // Check if passoutYear is null
    if (this.alumni.passoutYear === null) {
      return; // Exit if it's null
    }
    const date = new Date(this.alumni.passoutYear);
    this.alumni.passoutYear = date.getFullYear(); // Set passoutYear to the selected year
    this.validateExperience();
  }

  validateExperience(): boolean {
    const currentYear = new Date().getFullYear();
    const passoutYear = this.alumni.passoutYear;
    const experience = parseInt(this.alumni.experience || '0');

    if (passoutYear && experience) {
      const maxExperience = currentYear - passoutYear;
      if (experience > maxExperience) {
        this.experienceError = `Experience cannot exceed ${maxExperience} years.`;
        return false;
      }
    }
    this.experienceError = null; // No error
    return true;
  }


  onSubmit(alumniForm: NgForm) {
    if (alumniForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      alumniForm.form.markAllAsTouched();
      return; // Prevent form submission if the form is invalid
    }

    if (!this.validateExperience()) {
      return; // Prevent form submission if experience is invalid
    }


    this.loading = true;

    this.alumniService.addAlumnus('alumni', this.alumni)
      .subscribe(response => {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful !!',
          toast: true,
          position: 'top-start',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true
        });
        alumniForm.resetForm();
        this.mobileNumberError = null;
        this.experienceError = null;

      }, error => {
        if (error.status === 400 && error.error.message) {
          this.mobileNumberError = error.error.message; // error message for duplicate mobile number
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error while registration',
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true
          });
        }
      }
      )
      .add(() => {
        this.loading = false;
      });
  }
  onMobileNumberChange() {
    this.mobileNumberError = null;
  }
}
