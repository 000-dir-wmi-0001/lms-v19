import { Component, ElementRef, OnInit, Renderer2, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
// import { data } from 'jquery';
import * as $ from 'jquery';

import { CourseService } from '../../../services/course.service';
import { StorageService } from '../../../services/storage.service'; 
import { UserService } from '../../../services/user.service'; 
import { CommonModule } from '@angular/common';
import { FeeService } from '../../../services/fee.service'; 
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

import {
  toSvg,
  toCanvas,
  toPixelData,
  toPng,
  toJpeg,
  toBlob,
  getFontEmbedCSS
} from 'html-to-image';

import jspdf, { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { ReceiptService } from '../../../services/receipt.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { environment } from '../../../../environments/environment';
declare var Razorpay: any;
@Component({
  selector: 'app-fee-receipt',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './fee-receipt.component.html',
  styleUrl: './fee-receipt.component.css'
})
export class FeeReceiptComponent implements OnInit {
  isLoading = true;
  token: any;
  userId: any;
  role: any;
  courses: any = [];
  courseIds: any;
  userCourses: any = [];
  staticCourses: any = [];
  isVerified = true;
  paymentDate: any = new Date();
  modulefeeComplete: any;
  studentInfo = {
    firstName: '',
    lastName: '',
    mobileno: '',
    email: '',
    dob: '',
    clg: '',
    isVerified: true,
  };

  receiptForm: UntypedFormGroup = new UntypedFormGroup({
    module: new UntypedFormControl(''),
    installments: new UntypedFormControl(''),
  });

  totalFees: any = '';
  FeesToBePaid: any = '';
  paymentMode: any;
  receiptId: any = 'receiptId123';
  isSubmited: boolean = false;
  formEntries: any = {};
  feeComplete = false;
  isReceiptExists = false;
  lastInstallment?: boolean;
  selectedModule?: { module: any };
  feeStatus?: string;
  bsModalRef?: import('ngx-bootstrap/modal').BsModalRef<unknown>;
  allReceipts: any;
  moduleId: any;
  moduleName: any;
  moduleInstallments: any;
  paymentDetails: any;
  modulesDetails: any;

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router,
    private courseService: CourseService,
    private feeService: FeeService,
    private formBuilder: UntypedFormBuilder,
    private receiptService: ReceiptService,
    private modalService: BsModalService,
    private el: ElementRef, 
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    this.getUserDeatails(this.userId);
    this.isLoading = false;
    this.receiptForm = this.formBuilder.group({
      module: ['', [Validators.required]],
      installments: [''],
    });
    this.getPaymentDetails(this.userId);
    //this.getStaticCourses();

  }
  call(): void {
    console.log(this.formEntries, 'this are state');
  }

  getPaymentDetails(userId: any): void {
    //alert(userId);
    this.userService.getPaymentDetails(userId).subscribe({
      next: (response:any) => {
        this.paymentDetails = response.payment;
        console.log(this.paymentDetails,"this.paymentDetails");
        this.displayPaymentDetail();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  openFeesModal() {
    
  }


  displayPaymentDetail() {

  this.paymentDetails.forEach((payment:any) => {
    const modulesName = payment.modules.map((module: any) => module.name).join(', ');

    this.staticCourses.push({
      _id: payment._id,
      price: payment.Totalfees,
      name:modulesName,
      installments: Number(payment.installmentsAllowed),
      pendingInstallments: Number(payment.pendingInstallments),
      validTill: payment.validTill,
    });
   
  });
  console.log(this.staticCourses, "Static courses with all modules");

  }
    // this.staticCourses.push({
    //   _id: payment._id,
    //   name: payment
    // });
    // let arrayId = [];
    // let arr2 = [];
    // for (let i = 0; i < payment.length; i++) {
    //   const element = payment[i];
    //   console.log(payment[i]);

    //   for (let j = 0; j < element.modules.length; j++) {
    //     arr2.push(element.modules[j]);
    //   }
    //   arrayId.push(arr2);
    //   arr2 = [];
    // }
    // for (let i = 0; i < arrayId.length; i++) {
    //   let count: number = 0;
    //   this.courseService.getUserModules(arrayId[i]).subscribe({
    //     next: (response: any) => {
    //       const details: string[] = [];
    //       for (let j = 0; j < response.module.length; j++) {
    //         details.push(response.module[j].name);
    //       }
    //       this.staticCourses.push({
    //         _id: payment[i]._id,
    //         name: details.join(', '),
    //         price: payment[i].Totalfees,
    //         installments: Number(payment[i].installmentsAllowed),
    //         pendingInstallments: Number(payment[i].pendingInstallments),
    //         validTill: payment[i].validTill,
    //       });
    //       console.log(this.staticCourses,"this are statcicourses form payment modules i guess!")
    //     },
    //     error: (err: any) => {
    //       console.log(err);
    //     },
    //   });
    //   console.log(i);
    // }
  

  payforModule(): void {
    console.log(this.FeesToBePaid, this.moduleId, this.userId, "has to send to api");
    this.courseService
      .createOrder(this.FeesToBePaid, this.moduleId, this.userId)
      .subscribe((order) => {
        const options = {
          key: environment.raz_key_id,
          amount: this.FeesToBePaid * 100,
          name: 'Linkcode Technologies',
          description: this.moduleName + " enrollment",
          image: 'https://www.abhijitgatade.com/assets/img/favicon.png',
          order_id: order.orderId,
          handler: (response: any) => {
            var event = new CustomEvent('payment.success', {
              detail: response,
              bubbles: true,
              cancelable: true,
            });
            window.dispatchEvent(event);
            console.log(response, "response form handler")
            const paymentId = response.razorpay_payment_id;
            const orderId = response.razorpay_order_id;
            const signature = response.razorpay_signature;

            this.courseService
              .verifyPayment(paymentId, orderId, signature)
              .subscribe({
                next: (res: any) => {
                  console.log(res, 'response of verify payment');
                  console.log(
                    paymentId,
                    orderId,
                    signature,
                    'payid, orderid, signature'
                  );
                },
                error: (err: any) => {
                  console.log(err, 'error of verify payment');
                },
              });
          },
          prefill: {
            name: 'Akanksha Dhage',
            email: 'aditi@gmail.com',
            contact: '1234567890',
          },
          theme: {
            color: '#3399cc',
          },
        };

        var rzp = new Razorpay(options);
        rzp.open();

        rzp.on('payment.failed', function (response: any) {console.log(response)});
      }),
      (error: any) => {
        console.log(error, 'last error col');
      };
  }

  submitReceipt(): void {
    console.log(this.receiptForm.valid);
    console.log(this.FeesToBePaid, this.moduleId, this.feeComplete, this.receiptForm.value.installments, this.userId, "has to send to api");
    if (this.receiptForm.valid) {
      this.formEntries = {
        userId: this.userId,
        receiptId: this.receiptId,
        module: this.receiptForm.value.module,
        thisInstallmentAmount: this.FeesToBePaid,
        paymentMode: 'online',
        transactionId: '00000000',
        installment: this.receiptForm.value.installments,
        paymentDate: this.paymentDate,
        feeComplete: this.feeComplete,
        studentInfoObj: this.studentInfo,
        isVerified: true,
      };
      console.log(this.formEntries, 'formentries at submit');
      this.router.navigate(['/dashboard/fee/print-receipt'], {
        state: this.formEntries,
      });
    }
  }

  admissionDateValidator(control: AbstractControl) {
    const adm = new Date(control.value);
    const today = new Date();

    if (today.getDate < adm.getDate) {
      return { invalid: true };
    }
    return null;
  }
  ageValidator(control: AbstractControl) {
    const birthdate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - birthdate.getFullYear();

    if (age < 18) {
      return { invalid: true };
    }
    return null;
  }
  displayTotalFees(): void {
    this.totalFees = 0; // Initialize totalFees to 0
    this.moduleId = '';
    this.moduleName = '';
    this.moduleInstallments = 2; // Default value

    const selectedModule = this.receiptForm.value.module;
    const course = this.staticCourses.find((c: { name: any; }) => c.name === selectedModule);

    if (course) {
      this.totalFees = course.price;
      this.moduleId = course._id;
      this.moduleName = course.name;
      this.moduleInstallments = course.installments || 2;

      const selectElement = this.el.nativeElement.querySelector('#installments');
      this.clearSelectOptions(selectElement); // Clear existing options

      const maxInstallments = 5;
      for (let i = 1; i <= this.moduleInstallments; i++) {
        const option = this.renderer.createElement('option');
        option.value = i;
        option.text = i.toString();
        this.renderer.appendChild(selectElement, option);
      }
    }
    this.receiptService
      .isFeeComplete(this.userId, this.receiptForm.value.module)
      .subscribe({
        next: (data: any) => {

          if (data.isComplete) {
            this.feeComplete = true;
            this.lastInstallment = true;
            this.feeStatus = 'complete';
            this.FeesToBePaid = 0;
            console.log(data, 'last installment done');
          } else if (!data.isComplete) {
            this.lastInstallment = true;
            this.FeesToBePaid = this.totalFees / 2;
            this.feeStatus = 'pending';
            console.log(data, 'last installment remaining');
          }
        },
        error: (err) => {
          console.log(err);
          this.lastInstallment = false;
          console.log(err, 'last installment remaining');
        },
      });
  }

  clearSelectOptions(selectElement: HTMLSelectElement) {
    while (selectElement.firstChild) {
      selectElement.removeChild(selectElement.firstChild);
    }
  }
  displayFeesToBePaid(): void {
    let i = this.receiptForm.value.installments;
    this.FeesToBePaid = this.totalFees / i;
  }

  prevReceipts(template: TemplateRef<any>) {
    this.bsModalRef = this.modalService.show(template);
    this.receiptService.getUserReceipts(this.userId).subscribe({
      next: (data: any) => {
        this.allReceipts = data.result;
        console.log(this.allReceipts, 'data');
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  printReceipt() {
    console.log('printing receipt again');
  }


  // paymentCall():void {
  //   console.log("im called");
  //   this.isVerified = true;
  //   let data = {
  //     "isVerified": true
  //   }
  //   console.log(this.isVerified);
  //   this.receiptService.verifyPayment(this.userId, data).subscribe({
  //     next:(data:any) => {
  //       console.log(data, "Receipt is verified");
  //     },
  //     error:(error:any) => {
  //     console.log(error,"error");
  //     }
  //   })
  //   console.log("payment call fn called")
  // }

  getStaticCourses(): void {
    this.feeService.getALlStaticCourses().subscribe({
      next: (data: any) => {
        this.staticCourses = data;

        console.log("Data");

        console.log(this.staticCourses);

      },
      error: (err: any) => {
        console.log('error', err);
      },
    });
  }

  getUserDeatails(userId: any): void {



    this.userService.getUser(userId).subscribe({
      next: (data: any) => {
        this.courses = data.user.courses;
        //console.log(data);
        this.studentInfo = {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          mobileno: data.user.mobileno,
          email: data.user.email,
          dob: data.user.dob,
          clg: data.user.clg,
          isVerified: data.user.isVerified,
        };
        this.courseIds = this.courses.join(',');
        this.getUserCourses();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  getUserCourses(): void {
    this.courseService.getUserCourses(this.courseIds).subscribe({
      next: (data: any) => {
        console.log('from frontend', data);
        this.userCourses = data.course;
      },
      error: (err) => {
        console.log('error in getusercourses', err);
      },
    });
  }

  makeReceipt(): void {
    this.router.navigate(['../../print-receipt']);
  }

  goforPayment(): void {
    console.log('go for payment called..', this.formEntries);
    this.router.navigate(['../print-receipt'], { state: this.formEntries });
  }
}

interface Module {
  _id: string;
  name: string;
  price: number;
  __v: number;
}
