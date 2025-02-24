import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FeeService } from '../../../services/fee.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-fee',
  imports: [CommonModule , FormsModule , ReactiveFormsModule],
  templateUrl: './edit-fee.component.html',
  styleUrl: './edit-fee.component.css'
})
export class EditFeeComponent implements OnInit {
  isLoading = false;
  studentList: any = [];
  paymentMode!: any;
  installment!: any;
  pendingFees!: any;
  totalFees!: any;
  userFirstName!: any;
  user!: any;

  form: UntypedFormGroup = new UntypedFormGroup({
    Name: new UntypedFormControl(''),
    TotalFees: new UntypedFormControl(''),
    PendingFees: new UntypedFormControl(''),
    Installment: new UntypedFormControl(''),
    Mode: new UntypedFormControl(''),
    Amount: new UntypedFormControl(''),
  })
  constructor(private route: ActivatedRoute, private router: Router, private feeService: FeeService, private formBuilder: UntypedFormBuilder) { }
  feeId: any;
  ngOnInit(): void {
   this.isLoading = false;
    this.route.params.subscribe((params: Params) => {
      this.feeId = params['id'];

    });

    this.feeService.getUserFee(this.feeId).subscribe({
      next: (result: any) => {
        this.user = result.fee.user._id
        this.studentList = result.fee;
        this.installment = result.fee.installment;
        this.paymentMode = result.fee.paymentMode;
        this.pendingFees = result.fee.pendingFee;
        this.totalFees = result.fee.totalFee;
        this.userFirstName = result.fee.user.firstName + " " + result.fee.user.lastName;
      },
      error: (error: any) => {
        console.log(error);
      }
    })

    this.form = this.formBuilder.group(
      {
        Name: [''],
        TotalFees: [''],
        PendingFees: ['', [Validators.required]],
        Installments: ['', [Validators.required]],
        Mode: [''],
        Amount: ['', [Validators.pattern(/^\d*\.?\d+$/)]]
      }
    )
  }
 
  editFees() {
    this.isLoading = true;
    this.pendingFees -= this.form.get('Amount')?.value;

    if(this.form.valid){
      const userUpdateData = {
        "user": this.user,
        "totalFee": this.totalFees,
        "pendingFee": this.pendingFees,
        "installment": this.form.get('Installments')?.value,
        "paymentMode": this.form.get('Mode')?.value
      }
      this.feeService.editUserFee(this.feeId, userUpdateData).subscribe({
        next: (result) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard/fee']);
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
            icon: 'success',
            title: 'Fee edited',
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: { popup: 'swal-wide' },      
            didOpen: (toast:any) => {
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

    }else{
      
      this.isLoading = false;
      const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: { popup: 'swal-wide' },      
       didOpen: (toast:any) => {
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
