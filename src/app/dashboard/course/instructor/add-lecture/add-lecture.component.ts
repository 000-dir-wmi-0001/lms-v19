import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../../../environments/environment';
import { CommonModule } from '@angular/common';



@Component({
  imports: [FormsModule, ReactiveFormsModule, RouterLink, CommonModule],
  selector: 'app-add-lecture',
  templateUrl: './add-lecture.component.html',
  styleUrls: ['./add-lecture.component.css']
})
export class AddLectureComponent implements OnInit {

  lectureForm: UntypedFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    video: new UntypedFormControl(),
    thumbnail: new UntypedFormControl(),
    status: new UntypedFormControl('')
  })
  submitted = false;
  courseId = 0;
  url = '';
  url1 = '';
  file: any;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.courseId = this.route.snapshot.params['courseId'];
    this.lectureForm = this.formBuilder.group(
      {
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        video: ['', [Validators.required]],
        thumbnail: [''],
        status: ['', [Validators.required]]
      }
    )
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.lectureForm.controls;
  }

  thumbnail: any
  processThumbnail(event: any) {
    let files: FileList = event.target.files;
    this.thumbnail = files[0]

    if (this.thumbnail) {

      if (this.file.type == 'image/png' || this.file.type == 'image/jpg' || this.file.type == 'image/jpeg') {
        const maxSize = 1024 * 1024; // 1 MB (adjust this as needed)
        if (this.thumbnail.size > maxSize) {
          // alert('File size exceeds the limit. Please select a smaller file.');

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
        } else {
          // Handle the valid file here, e.g., upload it to a server.
        }
      } else {
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
          title: 'invalid file type',
        });
        event.target.value = '';
      }
    }
  }

  processVideo(event: any) {
    let files: FileList = event.target.files;
    this.file = files[0];
    console.log('file type is ', this.file.type)
    if (this.file) {
      const maxSize = 500 * 1024 * 1024; // 1 MB (adjust this as needed)
      if (this.file.type == 'video/mp4' || this.file.type == 'video/x-matroska') {
        console.log('valid type');
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
        } else {
          // Handle the valid file here, e.g., upload it to a server.
        }
      }
      else {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 5000,
          timerProgressBar: true,
          customClass: { popup: 'swal-wide' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Please choose mkv | mp4 file',
        });
        event.target.value = '';
      }
    }
  }

  uploadFileToS3() {
    this.submitted = true;
    if (this.lectureForm.invalid) {
      return;
    }

    this.isLoading = true;
    const { title, description, status } = this.lectureForm.value;
    const thumbnail = this.thumbnail?.name;
    this.http.post(environment.api + '/lecture/getUploadURL/' + this.file.name + '/' + title + '/' + this.courseId, { description, thumbnail, status }).subscribe((res: any) => {
      this.isLoading = true;

      this.url = res.url;
      this.url1 = res.url1;

      this.http.put(this.url, this.file).subscribe((res: any) => {
        if (this.url1) {
          this.isLoading = true;

          const thumbnailFile = this.thumbnail;
          this.http.put(this.url1, thumbnailFile).subscribe((res: any) => {
            this.isLoading = false;
          }, (error) => {
            this.isLoading = false;
          });
        }
        //else No thumbnail provided, so finish the upload
        this.isLoading = false;
        this.successMsg();
        this.router.navigate(['dashboard/course', this.courseId]);
      }, (error) => {
        this.isLoading = false;
        this.errorMsg();
      });

    }, (error) => {
      this.isLoading = false;
      const videoControl = this.lectureForm.get('video');
      const videoControlExists = videoControl !== null;

      if (videoControlExists) {
        videoControl?.setErrors({ 'urlError': true });
      } else {
        this.lectureForm.addControl('video', new UntypedFormControl(null));
        this.lectureForm.get('video')?.setErrors({ 'urlError': true });
      }
      this.submitted = true;
      //this.errorMsg();
    })
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Error while adding lecture',
      text: 'An error occurred while processing. Please try again later.',
      customClass: {
        popup: 'swal-wide'
      },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Lecture Added Successfully',
      text: 'The lecture has been added successfully.',
      customClass: {
        popup: 'swal-wide'
      },
    });
  }
}
