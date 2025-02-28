import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Injectable } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import Swal from 'sweetalert2';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Batch } from '../../services/batch.service';
// import { NgMaterialSearchModule } from 'ng-mat-select-search';

@Component({
  selector: 'app-admission-add',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatInputModule,],
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

  //testing batch list for all batches
  allBacthecs_list: any = [];
  allModules_list: any = [];
  //Selected modules id list
  selectedModuleIds: any[] = [];

  optionsControl = new FormControl([]);
  searchText = ''; // This will hold the search text entered by the user

  // get filteredOptions() {
  //   return this.allModules_list.filter((module: { viewValue: string; }) => module.viewValue.toLowerCase().includes(this.searchText.toLowerCase()));
  // }



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
      type: ['STUDENT'], // Default value for type,
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.compose([Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)])],
      // phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(10), Validators.maxLength(10)]],

      batchno: ['', [Validators.required]],
      moduleno: ['', [Validators.required]],
      status: ['', [Validators.required]],
      // module: ['', [Validators.required]],
    });
    this.getStaticCourses();


    // this.userService.getAllBatches().subscribe(
    //   (tempArr: any) => {
    //     // Once data is emitted, use spread operator to copy the array
    //     this.allBacthecs_list = [...tempArr];
    //     // console.log(this.allBacthecs_list); // Log the result
    //   },
    //   (error) => {
    //     // Handle any errors if the Observable fails
    //     console.error('Error fetching batches!!');
    //   }
    // );
    this.userService.getAllModules().subscribe(
      (tempArr: any) => {
        // Once data is emitted, use spread operator to copy the array
        this.allModules_list = [...tempArr.modules];
        // console.log(this.allModules_list); // Log the result
      },
      (error) => {
        // Handle any errors if the Observable fails
        console.error('Error fetching batches!!');
      }
    );
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
      formValues.phone,
      formValues.type,
      formValues.batchno,
      formValues.moduleno,
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
    console.log(formValues);
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


  //get Batches for selected Modules allBacthecs_list
  onModuleChange(event: any) {
    // Get the selected module IDs from the event
    this.selectedModuleIds = event.value;  // event.value will be an array of selected batch IDs

    // console.log(this.selectedModuleIds); // Log the selected module IDs

    // Check if module IDs are selected
    if (this.selectedModuleIds.length === 0) {
      console.log("No modules selected");
      return;
    }

    // Create the request body with the selected module IDs
    const body = {
      moduleno: this.selectedModuleIds
    };

    // Make the API request
    this.userService.getAllBatchByModuleIds(body).subscribe(
      (response: any) => {
        this.allBacthecs_list = [...response.batches]; // Assuming the API response has "batches" as an array
        // console.log(this.allBacthecs_list);
      },
      (error) => {
        console.error('Error fetching batches!!', error);
        if (error.status === 401) {
          console.error('Unauthorized - Token might be missing or invalid');
        } else if (error.status === 400) {
          console.error('Bad Request - Check the format of module IDs');
        }
      }
    );
  }

}
