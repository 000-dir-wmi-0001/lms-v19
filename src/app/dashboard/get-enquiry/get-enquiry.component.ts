import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';
import { Modal } from 'bootstrap';
import { Router, RouterLink } from '@angular/router';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  AbstractControl,
  UntypedFormArray,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-get-enquiry',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './get-enquiry.component.html',
  styleUrl: './get-enquiry.component.css'
})
export class GetEnquiryComponent implements OnInit {
  isMenuOpen = false;
  showEnquiryForm = false; // Boolean to control form display
  selectedStatus = 'all';
  selectedReview = '1';
  modalRef!: BsModalRef;
  msgText: any;
  userMobile: any;
  fileName: string = 'EnquiryExcelSheetLinkcodeLMS.xlsx';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  totalPages: number = 0
  expandedRows: Set<string> = new Set();
  courseOptions: string[] = ["C", "C++", "DSA", "Java full stack", "Python full stack", "Data Science", "Mean/Mern Stack", "Others"];
  selectedCourses: any = [];
  isLoggedIn = false;
  errMessage: string = '';
  source!: string;

  enquiryForm: UntypedFormGroup = new UntypedFormGroup({
    fullName: new UntypedFormControl(''),
    phoneNumber: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
    status: new UntypedFormControl(''),
    enqDescription: new UntypedFormControl(''),
    courseEnrolledIn: new UntypedFormArray([], this.atLeastOneCourseSelected),
    // source: new UntypedFormControl('')
  });
  submitted = false;
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
  localEnquiries!: any[];

  // Custom phone number validator
  validatePhoneNumber(control: AbstractControl): { [key: string]: any } | null {
    const value = control.value;
    if (value && value.length !== 10) {
      return { invalidPhoneNumber: true };
    }
    return null;
  }
  toggleEnquiryForm() {
    this.showEnquiryForm = !this.showEnquiryForm; // Toggle the display
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
  // Add these methods to your existing class
  toggleRow(id: string) {
    if (this.expandedRows.has(id)) {
      this.expandedRows.delete(id);
    } else {
      this.expandedRows.add(id);
    }
  }

  isExpanded(id: string): boolean {
    return this.expandedRows.has(id);
  }

  deleteEnquiry(id: string) {
    this.modalRef.hide();
    this.authService.deleteEnquiry(id).subscribe({
      next: (data: any) => {
        this.getEnquires();
      },
      error: (err) => { },
    });
  }
  openAddEnquiryForm() {
    const modalElement = document.getElementById('addEnquiryModal') as HTMLElement;

    if (modalElement) {
      const modal = new Modal(modalElement); // Explicitly imported Modal from Bootstrap
      modal.show();
    }
  }

  filterRecords() {
    if (this.selectedStatus == 'all') {
      this.getEnquires();
    } else if (['new', 'pending', 'completed'].includes(this.selectedStatus)) {
      this.enquiry = this.enquiry.filter((record: any) => {
        return record.status == this.selectedStatus;
      });
    }
  }

  searchEnquiries() {
    if (!this.name.trim()) {
      this.getEnquires();
    } else {
      this.enquiry = this.enquiry.filter((enquiry: any) => {
        return enquiry.fullName.toLowerCase().includes(this.name.toLowerCase());  // Filter by fullName
      });
    }
  }


  getEnquires(page: number = 1) {
    this.isLoading = true; // Show loader
    this.authService.getenquiry(page).subscribe({
      next: (data: any) => {
        // console.log(data, data.meta, "data res from api");

        this.isLoading = false
        this.enquiry = data.enquiries
        this.localEnquiries = [...this.enquiry];
        this.totalItems = data.meta?.totalCount;
        this.totalPages = data.meta?.totalPages;
        this.currentPage = data.meta?.currentPage; // Track the current page
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching enquiries', err);
      }
    });
  }

  getPages(): (number | string)[] {
    if (this.totalPages <= 4) {
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    if (this.currentPage <= 2) {
      return [1, 2, 3, '...', this.totalPages];
    } else if (this.currentPage >= this.totalPages - 1) {
      return [1, '...', this.totalPages - 2, this.totalPages - 1, this.totalPages];
    } else {
      return [1, '...', this.currentPage, '...', this.totalPages];
    }
  }

  onPageChange(page: number | string) {
    if (typeof page === 'number' && page >= 1 && page <= this.totalPages) {
      this.currentPage = page; // Update the current page
      this.getEnquires(page); // Fetch data for the new page from the backend
    }
  }

  constructor(
    private readonly modalService: BsModalService,
    private readonly authService: AuthService,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly router: Router

  ) { }
  enquiry!: any;
  name: any;
  updatedStatus = '';
  isLoading: boolean = true;
  enquiryList = [
    { name: 'Full Name' },
    { name: 'Phone Number' },

    { name: 'Email' },

    { name: 'Course Selected' },

    { name: 'status' },
  ];

  ngOnInit(): void {
    this.isLoading = true;
    this.currentPage = 1;
    this.getEnquires(this.currentPage)
    this.enquiryForm = this.formBuilder.group({
      fullName: ['', Validators.required],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.pattern('^\\d{10}$'),
          this.validatePhoneNumber
        ],
      ],
      email: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9._%+-]+@gmail\\.com$')
      ]],
      status: [''],
      enqDescription: ['', Validators.required],
      courseEnrolledIn: this.formBuilder.array([], this.atLeastOneCourseSelected)
    });
  }
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  cancel(): void {
    this.modalRef.hide();
  }
  onSubmit(): void {
    this.submitted = true;
    this.enquiryForm.get('fullName')?.setValue(this.enquiryForm.get('fullName')?.value?.trim() || '');


    if (this.enquiryForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.phoneNumberError = '';
    this.emailError = '';
    const ENQUIRY_SOURCES = 'MANUAL_ENTRY'

    const { fullName, phoneNumber, email, status, enqDescription } = this.enquiryForm.value;


    this.authService
      .enquiry(fullName, phoneNumber, email, ENQUIRY_SOURCES, this.selectedCourses, status, enqDescription,)
      .subscribe({
        next: (data) => {

          const modalElement = document.getElementById('addEnquiryModal');
          if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            if (modalInstance) {
              modalInstance.hide();
            }
          }


          this.submitted = true;
          this.enquiryForm.reset();
          this.selectedCourses = [];


          this.getEnquires();


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







          this.router.navigate(['/dashboard/get-enquiry']);

          window.location.reload();
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

          // Show error toast
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


  Review(singleEnquiry: any, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    singleEnquiry.review = selectedValue;
    const id = singleEnquiry._id;
    const reviewToUpdate = {
      _id: id,
      review: selectedValue,
    };
    this.authService.updateReview(reviewToUpdate);
  }

  Status(singleEnquiry: any, event: Event) {
    const target = event.target as HTMLSelectElement;
    const selectedValue = target.value;
    singleEnquiry.status = selectedValue;
    const id = singleEnquiry._id;
    const dataToUpdate = {
      _id: id,
      status: selectedValue,
    };
    this.authService.updateStatus(dataToUpdate);
  }

  ReplyToEnquiry(text: any, mobno: any) {
    console.log(mobno);
    this.userMobile = mobno;
    this.msgText = text;
    const whatsappUrl = `https://wa.me/${this.userMobile
      }?text=${encodeURIComponent(this.msgText)}`;
    window.location.href = whatsappUrl;
  }

  export() {
    let elementClone = document
      .getElementById('excel-table')
      ?.cloneNode(true) as HTMLElement;

    elementClone?.querySelectorAll('tr').forEach((row: HTMLElement) => {
      Array.from(row.children).forEach((cell) => {
        let cellElement = cell as HTMLElement;
        if (cellElement.querySelector('button')) {
          cellElement.innerHTML = '';
        }
      });

      let selectElement = row.querySelector('select');

      let selectedValue = selectElement ? selectElement.value : 'new';
      row.innerHTML = row.innerHTML.replace(
        '<select',
        `<span>${selectedValue}</span`
      );
    });

    elementClone?.querySelectorAll('option').forEach((option) => {
      option.remove();
    });

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(elementClone);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, this.fileName);
  }
  onEmailChange(): void {
    this.emailError = ''; // Clear email error when email changes
  }

  onPhoneNumberChange(): void {
    this.phoneNumberError = ''; // Clear phone number error when phone number changes
  }

}
