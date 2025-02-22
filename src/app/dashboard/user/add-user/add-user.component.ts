import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormControl, AbstractControl, UntypedFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-add-user',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  @ViewChild('modalTemplate')
  modalTemplate!: TemplateRef<any>;
  form: UntypedFormGroup = new UntypedFormGroup({
    firstName: new UntypedFormControl(''),
    lastName: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    role: new UntypedFormControl('')
  })
  bsModalRef!: BsModalRef;
  toolTip: boolean = false;


  isLoading: boolean = false;
  submitted = false;
  student: any;
  constructor(private formBuilder: UntypedFormBuilder, private storageService: StorageService, private userService: UserService, private router: Router, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.form = this.formBuilder.group(
      {
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        role: ['', [Validators.required]],
        batchno: [''],
        status: ['']
      }
    )
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }
  openModal(template: TemplateRef<any>) {

    this.bsModalRef = this.modalService.show(template);
    console.log("modal check");
  }
  nextpg() {
    this.bsModalRef.hide();
    this.router.navigate(['/dashboard/user'])
  }
  copyPassword(password: string) {
    navigator.clipboard.writeText(password)
      .then(() => {

        this.toolTip = true;
        setTimeout(() => {
          this.toolTip = false;
        }, 3000);
      })
      .catch(err => {
        console.error('Failed to copy password: ', err);
      });
  }
  addUser() {
    this.isLoading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.isLoading = false;
      return;
    }

    const { firstName, lastName, email, role, batchno, status } = this.form.value;
    this.userService.addUser(firstName, lastName, email, role, batchno, status).subscribe(
      {
        next: (data) => {
          this.isLoading = false;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            customClass: { popup: 'swal-wide' },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'User Added Successfully',
          });

          this.student = data;
          this.openModal(this.modalTemplate);
          console.log("toast check")
          // this.router.navigate(['dashboard/user']);

        },
        error: (err) => {
          this.isLoading = false;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            customClass: { popup: 'swal-wide' },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'error',
            title: 'Failed to add User',
          });
        }
      }
    );
  }

  getRole() {
    return this.storageService.getRole();
  }

}
