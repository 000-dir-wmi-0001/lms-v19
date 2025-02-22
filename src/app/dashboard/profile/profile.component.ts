import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
// import { valHooks } from 'jquery';

import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';

@Component({
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  activeTab = 'personal';
  token: any;
  userId: any;
  firstName: any;
  lastName: any;
  email: any;
  role: any;
  mobileno: any;
  dob!: Date;
  address: any;
  editStatus: any;
  academicSaveBtn: boolean = false;
  showEducationLevel: boolean = false;
  academicData: any;
  showData: boolean = false;
  file: any;
  constructor(private userService: UserService, private http: HttpClient, private storageService: StorageService, private router: Router, private formBuilder: UntypedFormBuilder) { }
  profilePictureUrl: string | null = null;
  personalForm!: UntypedFormGroup;
  academicForm!: UntypedFormGroup;
  changePasswordForm!: UntypedFormGroup;
  ngOnInit(): void {

    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    this.getDownloadUrlProfilePicture()
    this.getDetails(this.userId);
    this.getAcademicInfo();
    this.personalForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobileno: [{ value: this.mobileno }, Validators.pattern('[0-9]*')],
      parentsmobileno: ['', [Validators.required, Validators.pattern('[0-9]*')]],
      email: [''],
      address: ['', Validators.required],
      dob: ['']
    });



    this.academicForm = this.formBuilder.group({
      educationExperiences: this.formBuilder.array([])
    });
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });



  }

  passwordMatchValidator(group: UntypedFormGroup) {
    const newPassword = group?.get('newPassword')?.value;
    const confirmPassword = group?.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { mismatch: true };
  }
  addEducationExperience() {
    this.academicSaveBtn = true;
    this.showEducationLevel = true;
    const educationArray = this.academicForm.get('educationExperiences') as UntypedFormArray;

    if (educationArray.length === 0) {
      educationArray.push(this.createEducationExperience());
    }
  }

  get educationExperiences() {
    return (this.academicForm.get('educationExperiences') as UntypedFormArray).controls;
  }

  getAcademicInfo() {
    this.userService.getStudentAcademicDetails(this.userId).subscribe(
      (result: any) => {
        this.academicData = result;
        this.showData = true
      },
      (error) => {
        console.log(error);
      }
    );
  }
  createEducationExperience(): UntypedFormGroup {
    return this.formBuilder.group({
      educationLevel: ['', Validators.required],
      collegeName: ['', Validators.required],
      yop: ['', Validators.required],
      per: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.changePasswordForm.valid) {
      const data = {
        newPassword: this.changePasswordForm?.get('newPassword')?.value,
        oldPassword: this.changePasswordForm?.get('oldPassword')?.value
      }
      this.userService.changeStudentPasswordFromProfile(this.userId, data).subscribe(
        (result: any) => {
          this.toastr('success', 'Password changed')
          this.changePasswordForm.reset();
        },
        (error: any) => {
          this.toastr('error', 'Something went wrong')
        }
      )
    }
  }
  onFileSelected(event: any) {
    this.file = event.target.files[0];
    this.userService.getUploadURLProfilePicture(this.userId).subscribe(
      (result: any) => {
        this.putFile(result.url)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  putFile(url: any) {
    this.http.put(url, this.file).subscribe(
      (result: any) => {
        this.getDownloadUrlProfilePicture()
      },
      (error: any) => {
        console.log('error while puttinng', error)
      })
  }
  getDownloadUrlProfilePicture() {
    this.userService.getDownloadURLProfilePicture(this.userId).subscribe(
      (result: any) => {
        this.profilePictureUrl = result;

      },
      (error: any) => {
        console.log(error)
      }
    )
  };

  updateEditStatus(userId: string, action: string): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true
    });

    this.userService.requestEditOrCancel(userId, action).subscribe({
      next: (res: any) => {
        // Update the editStatus based on the action
        this.editStatus = action === 'request to edit' ? 'pending' : '';

        if (action === 'request to edit') {
          Toast.fire({
            icon: 'success',
            title: 'Request to edit has been sent to the admin.'
          });
        } else if (action === 'cancel') {
          Toast.fire({
            icon: 'info',
            title: 'Request to edit has been canceled.'
          });
        }

        console.log(this.editStatus);
      },
      error: (err: any) => {
        console.error(err);
        Toast.fire({
          icon: 'error',
          title: 'An error occurred while processing your request.'
        });
      }
    });
  }

  savePersonalInfo() {
    this.personalForm.get('email')?.setValue(this.email);
    this.personalForm.get('mobileno')?.setValue(this.mobileno);
    if (this.personalForm.valid) {
      console.log("personalform", this.personalForm.value);
      const payload = {
        ...this.personalForm.value,
        editStatus: '' // Reset editStatus
      };

      this.userService.updateUser(payload, this.userId).subscribe(
        (result) => {
          this.toastr('success', 'Saved personal info');
          this.personalForm.reset()
          this.getDetails(this.userId);
        },
        (error) => {
          console.log(error);
          this.toastr('error', 'something went wrong')
        }
      );
    }
    else {
      this.toastr('error', 'something went wrong')
    }
  }


  toastr(status: any, message: any) {
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
      icon: status,
      title: message,
    });


  }
  saveAcademicInfo() {
    if (this.academicForm.valid) {
      this.userService.createStudentAcademicDetails(this.academicForm.value, this.userId).subscribe(
        (result) => {
          this.toastr('success', 'Updated academic details')
          this.academicForm.reset()
          this.showEducationLevel = false
          this.getAcademicInfo()
          this.academicSaveBtn = false;
        },
        (error) => {
          console.log(error);
          this.toastr('error', 'something went wrong')
          this.academicSaveBtn = false;
        }
      );
    } else {
      this.toastr('error', 'something went wrong')
    }
  }

  getDetails(userId: any): void {
    this.userService.getUser(userId).subscribe({
      next: (data: any) => {
        console.log("details", data);

        this.firstName = data.user.firstName;
        this.lastName = data.user.lastName;
        this.email = data.user.email;
        this.role = data.user.type;
        this.mobileno = data.user.mobileno
        this.dob = data.user.dob
        this.editStatus = data.user.editStatus
        this.address = data.user.address
        console.log("role", this.role);

      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  navigateToCart() {
    this.router.navigate(['dashboard/course/cart']);
  }

  public getRole() {
    return this.storageService.getRole();
  }
}
