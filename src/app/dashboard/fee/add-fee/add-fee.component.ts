import { Component, OnInit } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  AbstractControl,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute  } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FeeService } from '../../../services/fee.service';
import { StorageService } from '../../../services/storage.service';
import { of, Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

  

@Component({
  standalone:true,
  selector: 'app-add-fee',
  imports: [CommonModule , FormsModule , ReactiveFormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule ],
  templateUrl: './add-fee.component.html',
  styleUrl: './add-fee.component.css'
})
export class AddFeeComponent implements OnInit {
  isLoading = false;
 keyword='firstName';
  firstName:any;
  lastName:any;
  isValueSelected: boolean = false;
  searchTerm: string = '';
  options: string[] = ['Option 1', 'Option 2', 'Option 3'];
  showDropdown: boolean = false;
  userId:any;
  token:any;
  selectedStud: any;
  effort!:any;
  effArr:any[] = [];
  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  addFeeForm : UntypedFormGroup = new UntypedFormGroup({
    
    selectedStudent:new UntypedFormControl(''),
    studentName:new UntypedFormControl(''),
    totalFee:new UntypedFormControl(''),  
    paymentMode:new UntypedFormControl(''),
    
  });
  public studentList: any = [];
   filteredStudents: any=[];

  currentFee: any = {
    studentName: '',
    firstName:'',
    lastName:'',
    totalFee:'',
   
    paymentMode:''
  };

  constructor(
    private feeService: FeeService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private storageService: StorageService,
    private modalService: BsModalService,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
   this.isLoading = false;
    this.feeService.getStudentUser().subscribe({
      next: (data: any) => {
        this.feeService.serviceStudentList = data.studentUsers;
        this.studentList = this.feeService.serviceStudentList;
        this.effArr=this.studentList
      },
      error: (err) => {
        console.log(err);
      },
    });   

    this.addFeeForm = this.fb.group({
      selectedStudent: this.fb.control(''),
      studentName: this.fb.control('', [Validators.required]),
      totalFee: this.fb.control('', [Validators.required]),
     
      paymentMode: this.fb.control('', [Validators.required]),
    });
  }
 
  selectEvent(item:any){
    this.addFeeForm.get("studentName")?.setValue(item.firstName+' '+item.lastName)
    this.firstName=item.firstName;
    this.lastName=item.lastName;
  }
 
  // onChangeSearch(search:string){
  //   this.feeService.searchStudent(search).subscribe(
  //     (data)=>{
  //       this.filteredStudents=data
  //     }
  //   )
  // }
  onChangeSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const search = inputElement?.value?.trim(); // Ensure value exists and trim extra spaces
  
    if (search) {
      this.feeService.searchStudent(search).subscribe({
        next: (data) => {
          this.filteredStudents = data;
        },
        error: (err) => {
          console.error("Error fetching students:", err);
          this.filteredStudents = []; // Handle potential errors gracefully
        },
      });
    } else {
      this.filteredStudents = []; // Clear suggestions if input is empty
    }
  }
  onFocused(e:any){
    console.log('e',e)
  }
  cancelStudent(){
    this.router.navigate(['../../fee'], { relativeTo: this.route });
  }

  saveStudent() {
    
    this.isLoading = true;
   console.log(this.addFeeForm.valid)
   if(this.addFeeForm.valid){    
    this.currentFee = this.addFeeForm.value;
    this.feeService.setFee(this.firstName,this.lastName, this.currentFee.totalFee, this.currentFee.paymentMode).subscribe({
      next: (res : any) => {
        
        this.isLoading = false;
    this.router.navigate(['../../fee'], { relativeTo: this.route });
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
      title: 'Fee created',
    });
      },
      error: (err) => {        
        this.isLoading = false;
        console.log('err',err)
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
          title: err.error.message,
        });
      }
    })
   } else{
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
      title: 'Bad Input',
    });
   }    
    }
  }

