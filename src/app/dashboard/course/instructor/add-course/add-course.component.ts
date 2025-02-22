import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CourseService } from '../../../../services/course.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css'],
})
export class AddCourseComponent implements OnInit {
  courseForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    category: new UntypedFormControl(''),
    price: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
  });
  submitted = false;
  url = '';
  file: any;
  isLoading = false;

  constructor(
    private courseService: CourseService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.courseForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, this.positiveNumeric]],
      description: ['', [Validators.required]],
      thumbnail: ['', [Validators.required]],
    });
  }

  positiveNumeric(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) {
      return { required: true };
    }
    // Check if the value is a number and greater than 0
    if (isNaN(value) || value < 0) {
      return { positiveNumeric: true };
    }
    return null;
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.courseForm.controls;
  }

  processImage(event: any) {
    let files: FileList = event.target.files;

    this.file = files[0];

    if (this.file) {
      if (this.file.type == 'image/png' || this.file.type == 'image/jpg' || this.file.type == 'image/jpeg') {
        const maxSize = 1024 * 1024; // 1 MB (adjust this as needed)
        if (this.file.size > maxSize) {

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
            title: 'file size exceeded',
          });
          event.target.value = ''; // Clear the file input
        }
      }
      else {
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
          title: 'Invalid file type',
        });
        event.target.value = '';
      }
    }
  }

  uploadFileToS3() {
    this.submitted = true;
    if (this.courseForm.invalid) {
      return;
    }
    const { name, category, price, description } = this.courseForm.value;
    this.isLoading = true;
    this.http
      .post(environment.api + '/course/getUploadURL/' + this.file.name, {
        name,
        thumbnail: this.file.name,
        category,
        price,
        description,
      })
      .subscribe(
        (res: any) => {
          this.url = res.url;
          if (this.url && this.file) {
            this.isLoading = true;
            this.http.put(this.url, this.file).subscribe(
              (res: any) => {
                this.isLoading = false;
                this.successMsg();
                console.log('Success');
                this.router.navigate(['/dashboard/course']);
              },
              (error) => {
                this.isLoading = false;
                this.errorMsg();
              }
            );
          }
        },
        (error) => {
          this.isLoading = false;
          this.errorMsg();
        }
      );
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Failed to add course',
      text: 'An error occurred while processing. Please try again later.',
      customClass: {
        container: 'swal-wide'
      },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Course added Successfully',
      text: 'The Course has been added successfully.',
      customClass: {
        container: 'swal-wide'
      },
    });
  }
}
