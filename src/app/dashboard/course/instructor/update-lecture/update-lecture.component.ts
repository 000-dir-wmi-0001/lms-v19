import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { CourseService } from '../../course.service';
import { environment } from '../../../../../environments/environment';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-update-lecture',
  templateUrl: './update-lecture.component.html',
  styleUrls: ['./update-lecture.component.css'],
})
export class UpdateLectureComponent implements OnInit {
  lectureForm: UntypedFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    status: new UntypedFormControl(''),
    video: new UntypedFormControl(),
  });
  id: any;
  title: any;
  descr: any;
  status: any;
  lecture: any;
  submitted = false;
  courseId = 0;
  url = '';
  file: any;
  isLoading = false;
  lectureId = 0;
  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.courseId = this.route.snapshot.params['courseId'];
    this.lectureId = this.route.snapshot.params['lectureId'];

    //take lecture info
    this.courseService.getLecture(this.lectureId).subscribe({
      next: (data: any) => {
        this.lecture = data;
        this.title = data.title;
        this.descr = data.description;
        this.status = data.status;
        this.id = data._id;
        this.lectureForm = this.formBuilder.group({
          title: [this.title, [Validators.required]],
          description: [this.descr, [Validators.required]],
          status: [this.status, [Validators.required]],
          video: ['', [Validators.required]],
        });
      },
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.lectureForm.controls;
  }

  processImage(event: any) {
    if (event) {
      let files: FileList = event.target.files;
      this.file = files[0];
    }

    let key;
    if (this.file) {
      key = this.file.name;
    }
    const { title, description, status } = this.lectureForm.value;

    this.isLoading = true;
    this.http
      .put(
        environment.api +
        '/lecture/updateLecture/' +
        this.id +
        '/' +
        this.courseId,
        { title, description, status, key }
      )
      .subscribe(
        (res: any) => {
          this.url = res.url;
          this.isLoading = false;
        },
        (error) => {
          const videoControl = this.lectureForm.get('video');
          const videoControlExists = videoControl !== null;

          if (videoControlExists) {
            videoControl?.setErrors({ required: 'Failed to upload the video' });
          } else {
            this.lectureForm.addControl('video', new UntypedFormControl(null));
            this.lectureForm
              .get('video')
              ?.setErrors({ required: 'Failed to upload the video' });
          }
          this.isLoading = false;
          this.submitted = true;
        }
      );
  }

  uploadFileToS3() {
    this.submitted = true;
    if (this.lectureForm.invalid) {
      return;
    }

    if (this.submitted) {
      //if there is an error getting url for uploading video
      this.errorMsg();
    } else if (this.url && this.file) {
      //got url for uploading video
      this.isLoading = true;
      this.http.put(this.url, this.file).subscribe(
        (res: any) => {
          this.isLoading = false;
          this.successMsg();
        },
        (error: any) => {
          this.isLoading = false;
          this.errorMsg();
        }
      );
    } else {
      //update the metadata
      let key;
      key = this.lecture.filename;
      const { title, description, status } = this.lectureForm.value;
      this.http
        .put(
          environment.api +
          '/lecture/updateLectureInfo/' +
          this.id +
          '/' +
          this.courseId,
          { title, description, status, key }
        )
        .subscribe(
          (res: any) => {
            this.isLoading = false;
            this.successMsg();
            this.router.navigate(['dashboard/course', this.courseId]);
          },
          (error: any) => {
            this.isLoading = false;
            this.errorMsg();
          }
        );
    }
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Error while updating lecture',
      text: 'An error occurred while processing. Please try again later.',
      customClass: {
        container: 'swal-wide'
      },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Lecture Updated Successfully',
      text: 'The lecture has been updated successfully.',
      customClass: {
        container: 'swal-wide'
      },
    });
  }
}
