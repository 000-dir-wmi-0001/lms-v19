import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { Modal } from 'bootstrap';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { PlacementsService } from '../../services/placements.service';
import * as bootstrap from 'bootstrap';
import { ToasterService } from '../../toaster/toaster.service';
import { Router } from '@angular/router';
import { AbstractControl } from '@angular/forms';
import { MessageService } from '../../services/message.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-landing-page',
  imports: [ ReactiveFormsModule , CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent implements OnInit {

  token: any;
  userId: any;
  isLoggedIn = false;
  role: any;
  contact = 919604430489;

  isNavExpanded = false;
  brochureForm: UntypedFormGroup;
  source?: string; 
  isLoading = false;
  placements: any[] = [];
  placementPairs: any[][] = []; 
  phoneNumberError: string = '';
  errMessage: string = '';
  emailError: string = '';
  modalElement: HTMLElement | null = null; 

  // Modal state
  enquiryModal!: Modal; 
  enquiryForm: UntypedFormGroup = new UntypedFormGroup({
    fullName: new UntypedFormControl(''),
    phoneNumber: new UntypedFormControl(''),
    email: new UntypedFormControl(''),
  
  });

  submitted = false;

  // Toast configuration
  toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
customClass: { popup: 'swal-wide' },    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    },
  });

  isUserInteracted= false;

  constructor(
    private storageService: StorageService,
    private fb: UntypedFormBuilder,
    private authService: AuthService,
    private placementsService: PlacementsService,
    private toasterService: ToasterService,
    private router: Router,
    private message: MessageService,
    private sanitizer: DomSanitizer,
    private renderer: Renderer2
  ) {


    this.isLoading = false;
    this.enquiryForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/), // Exactly 10 digits
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/) // Strict Gmail validation
      ]]
    });
    
    this.brochureForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[a-zA-Z ]*$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      mobile: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      courseC: [false],
      courseCpp: [false],
      courseDSA: [false],
      courseJavaFullStack: [false],
      coursePythonFullStack: [false],
      courseDataScience: [false],
      courseMEARNStack: [false],
      courseOther: [false]
    }, { validator: this.atLeastOneCourseSelected });

  }
  // Custom validator for course selection
  atLeastOneCourseSelected(group: AbstractControl): { [key: string]: boolean } | null {
    const courses = [
      'courseC', 'courseCpp', 'courseDSA', 'courseJavaFullStack',
      'coursePythonFullStack', 'courseDataScience', 'courseMEARNStack', 'courseOther'
    ];

    const hasSelectedCourse = courses.some(course => group.get(course)?.value === true);
    return hasSelectedCourse ? null : { noCourseSelected: true };
  }

  ngOnInit(): void {
    this.token = this.storageService.getToken();
    if (this.token) {
      this.userId = JSON.parse(atob(this.token?.split('.')[1]))?._id;
    }
    this.isLoggedIn = !!this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      localStorage.clear();
    }
    this.role = this.storageService.getRole();

    this.fetchPlacements();

    // Listen for user interactions
    this.renderer.listen('window', 'click', () => this.onUserInteraction());
    this.renderer.listen('window', 'scroll', () => this.onUserInteraction());
    this.renderer.listen('window', 'keydown', () => this.onUserInteraction());
  }
 
  checkAndShowEnquiryModal(): void {
    const enquirySubmitted = this.getCookie('enquirySubmitted');
    const modalElement = document.getElementById('enquiryModal');

    if (!enquirySubmitted && modalElement) {
      this.enquiryModal = new bootstrap.Modal(modalElement, { backdrop: 'static', keyboard: false });
      setTimeout(() => {
        this.enquiryModal.show();
      }, 500);
    }
  }

onUserInteraction(): void {
  if (!this.isUserInteracted) {
    this.isUserInteracted = true;
    this.checkAndShowEnquiryModal();
  }
}
  get formControl(): { [key: string]: AbstractControl } {
    return this.enquiryForm.controls;
  }

  openEnquiryModal() {
    const modalElement = document.getElementById('enquiryModal');
    if (modalElement) {
      this.enquiryModal = new bootstrap.Modal(modalElement);
      this.enquiryModal.show();
    }
  }

  closeEnquiryModal() {
   
      this.enquiryModal.hide();
  }

  fetchPlacements(): void {
    this.placementsService.getPlace().subscribe({
      next: (data: any) => {
        this.placements = data;
        this.placementPairs = [];
        for (let i = 0; i < this.placements.length; i += 2) {
          this.placementPairs.push(this.placements.slice(i, i + 2));
        }
        console.log(this.placementPairs);
      },
      error: (error) => {
        console.error('Error fetching placements:', error);
      }
    });
  }

  public getRole() {
    return this.storageService.getRole();
  }

  toggleNavigation() {
    this.isNavExpanded = !this.isNavExpanded;
  }

  onSubmit(): void {
    this.submitted = true;
  
    // Trim whitespace from fullName
    this.enquiryForm.get('fullName')?.setValue(this.enquiryForm.get('fullName')?.value?.trim() || '');
  
    // Validate the form
    if (this.enquiryForm.invalid) {
      return;
    }
  
    this.isLoading = true;
    this.phoneNumberError = '';
    this.emailError = '';
    this.errMessage = '';
    const ENQUIRY_SOURCES= 'POPUP_MODAL'
  
    const { fullName, phoneNumber, email } = this.enquiryForm.value;
  
    // Call the enquiry service
    this.authService.enquiry(fullName, phoneNumber, email,ENQUIRY_SOURCES).subscribe({
      next: (data) => {
        this.isLoading = false;
  
        // Show success toast
        Swal.fire({
          icon: 'success',
          title: 'Enquiry sent successfully',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
      customClass: { popup: 'swal-wide' },          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
  
        // Set the "enquirySubmitted" cookie (expires in 7 days)
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 10); // 10 years later
        
        document.cookie = `enquirySubmitted=true; expires=${expiryDate.toUTCString()}; path=/`;
        // Hide the modal
        const enquiryModal = document.getElementById('enquiryModal');
        if (enquiryModal) {
          const modalInstance = bootstrap.Modal.getInstance(enquiryModal);
          modalInstance?.hide();
        }
  
        // Navigate to the desired route
        this.router.navigate(['/auth']);
      },
      error: (err) => {
        this.isLoading = false;
  
        // Handle specific error cases
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
        Swal.fire({
          icon: 'error',
          title: this.errMessage,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
      customClass: { popup: 'swal-wide' },          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
      },
    });
  }
  onBrochureSubmit(): void {
    // Mark all fields as touched to trigger validation display
    Object.keys(this.brochureForm.controls).forEach(key => {
      const control = this.brochureForm.get(key);
      control?.markAsTouched();
    });

    if (this.brochureForm.valid) {
      this.isLoading = true;
      const formData = this.brochureForm.value;
      const selectedCourses = [];
      
      // Collect selected courses
      if (formData.courseC) selectedCourses.push('C');
      if (formData.courseCpp) selectedCourses.push('C++');
      if (formData.courseDSA) selectedCourses.push('DSA');
      if (formData.courseJavaFullStack) selectedCourses.push('Java Full Stack');
      if (formData.coursePythonFullStack) selectedCourses.push('Python Full Stack');
      if (formData.courseDataScience) selectedCourses.push('Data Science');
      if (formData.courseMEARNStack) selectedCourses.push('MEARN Stack');
      if (formData.courseOther) selectedCourses.push('Other');

      this.authService.enquiry(
        formData.fullName,
        formData.mobile,
        formData.email,
        'BROCHURE',
        selectedCourses,
        'Pending',
        'Enquiry for brochure download'
      ).subscribe({
        next: () => {
          this.isLoading = false;
          this.downloadBrochure();
          
          Swal.fire({
            icon: 'success',
            title: 'Enquiry Received, Thank you!!',
            toast: true,
            position: 'top-start',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true
          });
          
          this.closeModal();
          this.brochureForm.reset();
          window.location.reload();
        },
        error: (err) => {
          this.isLoading = false;
          
          if (err.status === 400 && err.error.msg) {
            if (err.error.msg.includes('phone number')) {
              this.brochureForm.get('mobile')?.setErrors({'duplicate': true});
            }
            if (err.error.msg.includes('email')) {
              this.brochureForm.get('email')?.setErrors({'duplicate': true});
            }
          }
          
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: err.error?.msg || 'Failed to process your request',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true
          });
        }
      });
    }
  }

  // Helper methods for validation
  get f() {
    return this.brochureForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.brochureForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.brochureForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['pattern']) {
        if (fieldName === 'mobile') return 'Please enter a valid 10-digit number';
        if (fieldName === 'fullName') return 'Please enter a valid name';
        if (fieldName === 'email') return 'Please enter a valid email address';
      }
      if (control.errors['duplicate']) {
        return `This ${fieldName} is already registered`;
      }
    }
    return '';
  }

// Update downloadBrochure method to handle Google Drive links correctly
downloadBrochure(): void {
  const downloadLink = document.createElement('a');
  // Convert sharing URL to direct download URL
  const fileId = '1K1BhbIGMYvkG0wk7hi9U_sFil35pupf0';
  downloadLink.href = `https://drive.google.com/uc?export=download&id=${fileId}`;
  downloadLink.target = '_blank'; // Open in new tab
  downloadLink.download = 'brochure.pdf';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
  
  // Set cookie helper function
  setCookie(name: string, value: string, days: number): void {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // Cookie expiration time
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
  }

  closeEnquiryForm(){
    document.cookie = "enquirySubmitted=false; path=/";
  }
  
  // Get cookie helper function
  getCookie(name: string): string | null {
    const nameEq = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i].trim();
      if (c.indexOf(nameEq) === 0) {
        return c.substring(nameEq.length, c.length);
      }
    }
    return null;
  }
  


  closeModal(): void {
    const modalElement = document.getElementById('brochureModal');
    if (modalElement) {
      const modal = Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      } else {
        // Fallback if Modal instance is not found
        const modalInstance = new Modal(modalElement);
        modalInstance.hide();
      }
    }

    // Optionally, if the backdrop remains, manually remove it
    const backdropElement = document.querySelector('.modal-backdrop');
    if (backdropElement) {
      backdropElement.remove();
    }
    this.brochureForm.reset();
  }

  courses = [
    {
      title: 'Web design and development Crash course 2023',
      instructor: 'Mr. Rahul Ahire',
      rating: '4.7/5.0 ★★★★★',
      src: 'https://www.youtube.com/embed/S52z7wJ0uS4?list=PLgtAmyFr5GZFeDi-bAzzbmOqnSXoV5urX'
    },
    {
      title: 'C Programming Full Course 2023',
      instructor: 'Mr. Rahul Ahire',
      rating: '4.8/5.0 ★★★★★',
      src: 'https://www.youtube.com/embed/9sDBprvpE9c?list=PLgtAmyFr5GZHDUg_vPb2I8yIx6tRu369Y'
    },
    {
      title: 'Java Full Crash Course 2024',
      instructor: 'Mr. Rahul Ahire',
      rating: '4.9/5.0 ★★★★★',
      src: 'https://www.youtube.com/embed/hs5ACr-G6fg'
    }
  ];

  onEmailChange(): void {
    this.emailError = ''; 
  }

  onPhoneNumberChange(): void {
    this.phoneNumberError = ''; 
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}