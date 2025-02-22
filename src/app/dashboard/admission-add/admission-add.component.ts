import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admission-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './admission-add.component.html',
  styleUrl: './admission-add.component.css'
})
export class AdmissionAddComponent implements OnInit {
  @ViewChild('modalTemplate')
  modalTemplate!: TemplateRef<any>;
  myForm!: UntypedFormGroup;
  bsModalRef!: BsModalRef;
  toolTip: boolean = false;
  student: any;
  isLoading = false;
  moduleName: any;
  staticCourses: any = [];
  selectedCourses: string[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService,
    private location: Location,
  ) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      type: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      batchno: ['', [Validators.required]],
      status: ['', [Validators.required]],
      courses: ['', [Validators.required]], // assuming courses is an array of ObjectIds
      // module: ['', [Validators.required]],
    });
    this.getStaticCourses();
  }

  openModal(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
  }

  cancel() {
    this.bsModalRef.hide();
    this.router.navigate(['/dashboard/admission']);
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

  onSubmit() {
    const formValues = this.myForm.value;
    this.userService.addUser(
      formValues.firstName,
      formValues.lastName,
      formValues.email,
      formValues.type,
      formValues.batchno,
      formValues.status // Pass courses as an array of strings
    ).subscribe(
      (result: any) => {
        console.log(result);
        this.student = result;
        this.isLoading = false; // Stop the loader after getting the response
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
          title: 'User add Successfully',
        });
        this.openModal(this.modalTemplate);
      },
      (error: any) => {
        console.log(error);
        this.isLoading = false; // Stop the loader if there is an error
      }
    );
  }
  getStaticCourses(): void {
    this.userService.getALlStaticCourses().subscribe({
      next: (data: any) => {
        this.staticCourses = data;
      },
      error: (err: any) => {
        console.log('error', err);
      },
    });
  }


  goBack(): void {
    this.location.back();
  }
}
