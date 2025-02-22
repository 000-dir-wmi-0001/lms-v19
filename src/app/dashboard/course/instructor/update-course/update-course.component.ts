import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CourseService } from '../../course.service';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  selector: 'app-update-course',
  templateUrl: './update-course.component.html',
  styleUrls: ['./update-course.component.css'],
})
export class UpdateCourseComponent implements OnInit {
  courseForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    category: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    price: new UntypedFormControl(''),
    thumbnail: new UntypedFormControl(),
  });
  id: any;
  course: any;
  submitted = false;
  errMsg = '';
  courseId = 0;
  url = '';
  file: any;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.courseId = this.route.snapshot.params['courseId'];

    this.isLoading = false;
    //take course info
    this.courseService.getCourse(this.courseId.toString()).subscribe({
      next: (data: any) => {
        this.course = data.course;
        this.courseForm = this.formBuilder.group({
          name: [this.course.name],
          description: [this.course.description],
          category: [this.course.category],
          price: [this.course.price],
          thumbnail: [this.course.thumbnail],
        });
      },
    });

    this.courseForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.min(0), Validators.pattern('[0-9]*')]],
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
    if (event) {
      let files: FileList = event.target.files;
      this.file = files[0];
    }
  }

  uploadFileToS3() {
    this.submitted = true;
    if (this.courseForm.invalid) {
      return;
    }

    const { name, description, category, price } = this.courseForm.value;
    this.isLoading = true;
    this.http
      .put(environment.api + '/course/updateCourse/' + this.courseId, {
        name,
        description,
        category,
        price,
      })
      .subscribe(
        (res: any) => {
          //If Thumbnail selected, Get Presigned Url
          if (this.file) {
            this.UploadThumbnail();
          } else {
            this.isLoading = false;
            console.log('success updating course');
            this.successMsg();
          }
          this.router.navigate(['dashboard/course']);
        },
        (error: any) => {
          this.isLoading = false;
          this.errMsg =
            'An error occurred while processing. Please try again later.';
          this.errorMsg();
          this.router.navigate(['dashboard/course']);
        }
      );
  }

  UploadThumbnail() {
    let key = this.file.name;
    this.isLoading = true;
    //Get Presigned Url
    this.http
      .put(environment.api + '/course/updateThumbnail/' + this.courseId, {
        key,
      })
      .subscribe(
        (res: any) => {
          this.url = res.url;
          this.http.put(this.url, this.file).subscribe(
            (res: any) => {
              this.isLoading = false;
              this.successMsg();
              console.log('course updated successfully');
            },
            (error: any) => {
              this.isLoading = false;
              this.errMsg = 'Failed to update thumbnail metadata updated';
              this.errorMsg();
            }
          );
        },
        (error: any) => {
          this.isLoading = false;
          this.errMsg = 'Failed to update thumbnail metadata updated';
          this.errorMsg();
        }
      );
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Failed to update course',
      text: this.errMsg,
      customClass: {
        container: 'swal-wide'
      },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Course updated Successfully',
      text: 'The Course has been updated successfully.',
      customClass: {
        container: 'swal-wide'
      },
    });
  }
}
