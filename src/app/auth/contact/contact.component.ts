import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormControl,
  FormGroup,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  UntypedFormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from '../../services/auth.service';
import { ToasterService } from '../../toaster/toaster.service';
import { MessageService } from '../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact',
  imports: [ CommonModule , ReactiveFormsModule , RouterLink ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent implements OnInit {
  
  courseOptions: string[] = ["C", "C++", "DSA", "Java full stack", "Python full stack", "Data Science", "Mean/Mern Stack","Others"];
  selectedCourses: any = [];
  isLoggedIn=false;
  errMessage: string = '';

  enquiryForm: UntypedFormGroup = new UntypedFormGroup({
    fullName: new UntypedFormControl('', [Validators.required]), // Required validation
    phoneNumber: new UntypedFormControl('', [
      Validators.required, 
      Validators.pattern(/^\d{10}$/) 
    ]),
    email: new UntypedFormControl('', [
      Validators.required, 
      Validators.email 
    ]),
    status: new UntypedFormControl('', [Validators.required]), 
    enqDescription: new UntypedFormControl('', [Validators.required]), 
    courseEnrolledIn: new UntypedFormArray([], this.atLeastOneCourseSelected) 
  });
  submitted = false;
  isLoading=false;
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
  phoneNumberError: string = '';
  emailError: string = '';

  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly toasterService: ToasterService,
    private readonly router: Router,
    private readonly message:MessageService
  ) { }

  ngOnInit(): void {
    this.isLoading=false;
    this.enquiryForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d{10}$'), // Exactly 10 digits, no restriction on starting number
          this.validatePhoneNumber
        ],
      ],
      email: ['', [
        Validators.required, 
        Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$') // Strict Gmail validation
      ]],
      status: [''],
      enqDescription: ['',Validators.required],
      courseEnrolledIn: this.formBuilder.array([], this.atLeastOneCourseSelected)
    });
  }

  onBlur(fieldName: string): void {
    const control = this.enquiryForm.get(fieldName);
    if (control) {
      control.markAsTouched(); // Mark the field as touched for triggering validation
      // control.updateValueAndValidity(); // Trigger validation
    }
  }
  
  // Custom phone number validator
  validatePhoneNumber(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value && value.length !== 10) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }

  get formControl(): { [key: string]: AbstractControl } {
    return this.enquiryForm.controls;
  }

  // Custom validator to check if at least one course is selected
  atLeastOneCourseSelected(control: AbstractControl): { [key: string]: boolean } | null {
    const courses = control.value;
    return courses.length > 0 ? null : { required: true };
  }

  // Function to get the courseEnrolledIn form control
  get courseEnrolledIn(): UntypedFormArray {
    return this.enquiryForm.get('courseEnrolledIn') as UntypedFormArray;
  }

  // Function to handle courseEnrolledIn checkbox changes
  onCourseCheckboxChange(event: any, index: number) {
    const courseControl = this.courseEnrolledIn;

    if (event.target.checked) {
      courseControl.push(new UntypedFormControl(this.courseOptions[index]));
      this.selectedCourses.push(this.courseOptions[index]); // Add to selectedCourses
    } else {
      const controlIndex = courseControl.controls.findIndex(control => control.value === this.courseOptions[index]);
      if (controlIndex !== -1) {
        courseControl.removeAt(controlIndex); // Remove from FormArray
        this.selectedCourses.splice(this.selectedCourses.indexOf(this.courseOptions[index]), 1); // Remove from selectedCourses
      }
    }
  }

  onChange(data: any, inputEl: any) {
    if (inputEl === true) {
      this.selectedCourses.push(data)
    }
    else {
      const index = this.selectedCourses.indexOf(data);
      if (index !== -1) {
        this.selectedCourses.splice(index, 1);
      }
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.enquiryForm.get('fullName')?.setValue(this.enquiryForm.get('fullName')?.value?.trim() ||'')
    
    if (this.enquiryForm.invalid) {
      return;
    }
    
    this.isLoading=true;
    this.phoneNumberError = '';
    this.emailError = '';
    const ENQUIRY_SOURCES = 'WEBSITE_FORM'    
    const { fullName, phoneNumber, email, status, enqDescription} = this.enquiryForm.value;

    this.authService
      .enquiry(fullName, phoneNumber, email,ENQUIRY_SOURCES, this.selectedCourses, status, enqDescription, )
      .subscribe({
        next: (data) => {
          this.isLoading=false;
          this.toasterService.show(
            'success',
            'Well done!',
            'This is a success alert'
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
            title: 'Enquiry sent successfully',
          });
          
          this.router.navigate(['/auth'])
        },
        error: (err) => {
          this.isLoading = false;
          if (err.status === 400 && err.error.msg) {
            if (err.error.msg.includes('phone number')) {
              this.phoneNumberError = 'This phone number is already associated with an enquiry.';
            }
            if (err.error.msg.includes('email')) {
              this.emailError = 'This email is already associated with an enquiry.';
            }
            this.errMessage = err.error.msg;
          } else if (err.status === 401) {
            this.errMessage = err.error.message;
          } else {
            this.errMessage = 'Error Sending Enquiry';
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

  sendMsg(data:any){
    this.message.createMsg(data).subscribe(
      (data:any)=>{
        console.log(data)
      },
      (error:any)=>{
        console.log(error)
      }
    )
  }

  onReset(): void {
    this.submitted = false;
    this.enquiryForm.reset(); 
    this.selectedCourses = []; // Reset selected courses
    this.courseEnrolledIn.clear();
  }

  onEmailChange(): void {
    this.emailError = ''; // Clear email error when email changes
  }
  
  onPhoneNumberChange(): void {
    this.phoneNumberError = ''; // Clear phone number error when phone number changes
  }
}