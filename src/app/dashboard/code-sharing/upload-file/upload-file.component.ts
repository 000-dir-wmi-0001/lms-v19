import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {  Router } from '@angular/router';
import { CodesharingService } from '../../../services/codesharing.service'; 
import { StorageService } from '../../../services/storage.service'; 
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-file',
  imports: [CommonModule , FormsModule , ReactiveFormsModule],
  templateUrl: './upload-file.component.html',
  styleUrl: './upload-file.component.css'
})
export class UploadFileComponent implements OnInit {
  fileForm: UntypedFormGroup = new UntypedFormGroup({
    title: new UntypedFormControl(''),
    description: new UntypedFormControl(''),
    language: new UntypedFormControl(''),
  });

  allFilesInfo: any = [];
  submitted = false;
  file: any;
  url = '';
  isLoading = false;

  constructor(private FormBuilder: UntypedFormBuilder, private http: HttpClient, private codeSharingService: CodesharingService, private router:Router, private storageService: StorageService,) {}

  ngOnInit(): void {
    this.fileForm = this.FormBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      language: ['', [Validators.required]],
      file: ['', [Validators.required]],      
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.fileForm.controls;
  }

  public processFile(event: any) {
    let files: FileList = event.target.files;
    this.file = files[0];

    if (this.file) {
      const availableUserStorage = this.storageService.getStorage();
      console.log("available Storage: ", availableUserStorage);
      const maxSize = 5 * 1024 * 1024; // 1 MB (adjust this as needed)
      if (this.file.size > maxSize) {
        // alert('File size exceeds the limit. Please select a smaller file.');

        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: {popup : 'swal-wide'},
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
  }

  public uploadFileToS3() {
    //only text/coding files should be allowed
    this.submitted = true;
    if (this.fileForm.invalid) {
      return;
    }

    console.log('this.filename : ', this.file.name);
    const title = this.fileForm.get('title')?.value;
    console.log('title: ', title);
    const description = this.fileForm.get('description')?.value;
    console.log('desc: ',description);
    const name = this.file.name;
    const language = this.fileForm.get('language')?.value;
    console.log('language: ', language);



    this.codeSharingService.getUploadURL(name, title, description, language)
      .subscribe(
        (res: any) => {
          this.url = res.url;
          console.log('url: ', this.url);
          if (this.url) {
            this.http.put(this.url, this.file).subscribe(
              (res: any) => {
                this.successMsg();
                console.log('Success');
                this.router.navigate(['/dashboard/code-sharing']);
              },
              (error) => {
                console.log('got url but error uploading file');
                this.errorMsg();
              }
            );
          } else {
            console.log("didn't get url");
            this.errorMsg();
          }
        },
        (error) => {
          console.log('error in getting url');
          this.errorMsg();
        }
  );
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Error while uploading file',
      text: 'An error occurred while processing. Please try again later.',
      customClass: {popup : 'swal-wide'},
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'File uploaded Successfully',
      text: 'The File has been uploaded successfully.',
      customClass: {popup : 'swal-wide'},
    });
  }
}
