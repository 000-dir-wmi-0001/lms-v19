import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CourseService } from '../../../services/course.service'; 
import { FeeService } from '../../../services/fee.service'; 
import { ReceiptService } from '../../../services/receipt.service'; 
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-display-student-info',
  imports: [CommonModule , FormsModule ,ReactiveFormsModule],
  templateUrl: './display-student-info.component.html',
  styleUrl: './display-student-info.component.css'
})
export class DisplayStudentInfoComponent implements OnInit {
  courseIds: any = [];
  moduleIds: any = [];
  isVerified: any;
  bsModalRef?: import('ngx-bootstrap/modal').BsModalRef<unknown>;
  editforModule: any;
  isfeesEditing: boolean = false;
  editFeeforModule: any;
  isopenModuleForm?: boolean;
  staticCourses: any = [];
totalFees: any;
module: any;
editInstforModule: any;

  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private feeService: FeeService,
    private router: Router,
    private userService: UserService,
    private courseService: CourseService,
    private receiptService: ReceiptService
  ) {}
  studentId: any;
  studentData: any = [];
  name: any;
  mobileno = 100;
  mailid: any;
  dob: any;
  address: any;
  ugcollege: any;
  admissionDate: any;
  gradYear: any;
  sscpercent: any;
  hscpercent: any;
  degreeAgr: any;
  ugmajor: any;
  isEditing: boolean = false;
  accessValidTill: any = '2024';
  coursesDetail: any = {
    courseName: [],
    coursePrice: [],
    courseAccess: [],
  };

  isInstEditing: boolean = false;
  editforModuleId: any;
  newInstallment: any = 2;

  moduleDetails: any = {
    moduleId: [],
    moduleName: [],
    modulePrice: [],
    installments: [],
    pendingFees: [],
  };

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.studentId = params['id'];
      console.log(this.studentId);
    });
    this.fetchDetails();
    this.userDetails();
    // this.getPendingFees();
  }

  fetchDetails() {
    this.feeService.getUserFee(this.studentId).subscribe(
      (data: any) => {
        this.studentData = data.fee;
      },
      (error: any) => {
        console.log('error fetching student details', error);
      }
    );
  }
  goBack() {
    this.router.navigate(['/dashboard/fee/']);
  }
  toggleVerified(): void {
    this.isVerified = !this.isVerified;
  }
  userCourses(): void {
    this.courseService.getUserCourses(this.courseIds).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.course.length; i++) {
          this.coursesDetail.courseName.push(data.course[i].name);
          this.coursesDetail.coursePrice.push(data.course[i].price);
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  userModules(): void {
    this.courseService.getUserModules(this.moduleIds).subscribe({
      next: (data: any) => {
        for (let i = 0; i < data.module.length; i++) {
          this.moduleDetails.moduleId.push(data.module[i]._id);
          this.moduleDetails.moduleName.push(data.module[i].name);
          this.moduleDetails.modulePrice.push(data.module[i].price);
        }
        console.log(this.moduleDetails);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  academicDetails(): void {
    this.userService.getStudentAcademicDetails(this.studentId).subscribe({
      next: (data: any) => {
        console.log(data, 'academic details');
        this.sscpercent = data.sscPer;
        this.hscpercent = data.hscPer;
        this.degreeAgr = data.ugPer;
        this.gradYear = data.ugYop;
        this.ugcollege = data.ugClg;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }


  getStaticCourses(): void {
    this.feeService.getALlStaticCourses().subscribe({
      next: (data: any) => {
        this.staticCourses = data;
        console.log(this.staticCourses,"modules here");
      },
      error: (err: any) => {
        console.log('error', err);
      },
    });
  }

  displayTotalFees(): void {
    console.log(this.module);
    for (let i = 0; i < this.staticCourses.length; i++) {
      if (this.staticCourses[i].name === this.module) {
        this.totalFees = this.staticCourses[i].price;
      }
    }
  }



  userDetails(): void {
    this.userService.getUser(this.studentId).subscribe({
      next: (data: any) => {
        console.log(data, 'user found from user api');
        this.name = data.user.firstName + ' ' + data.user.lastName;
        this.mobileno = data.user.mobileno;
        this.mailid = data.user.email;
        this.dob = data.user.dob;
        this.address = data.user.address;
        this.courseIds = data.user.courses.join(',');
        this.moduleIds = data.user.modules.map(
          (moduleObj: any) => moduleObj.module
        );
        this.moduleDetails.installments = data.user.modules.map(
          (moduleObj: any) => moduleObj.installments
        );
        this.moduleDetails.pendingFees = data.user.modules.map(
          (moduleObj: any) => moduleObj.pendingFees
        );
        console.log(this.moduleDetails, 'pendingfees found');
        console.log(this.moduleIds, 'moduleids');
        this.isVerified = data.user.isVerified;
        this.userCourses();
        this.userModules();
        this.academicDetails();
      },
      error: (err) => {
        console.log(err, 'error');
      },
    });
  }

  completedFees: number = 0;
  installmentRecord: any;
  getInstallments(template: TemplateRef<any>, module: any): void {
    console.log('clicked module', module);
    this.bsModalRef = this.modalService.show(template);
    this.receiptService.isFeeComplete(this.studentId, module).subscribe({
      next: (data: any) => {
        console.log(data);
        this.installmentRecord = data.result;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  editModulesPendingFees(i: any): void {
    this.isfeesEditing = true;
    this.editFeeforModule = i;
    const module = this.moduleDetails.moduleName[i];
    this.receiptService.isFeeComplete(this.studentId, module).subscribe({
      next: (data: any) => {
        console.log(data);
        this.installmentRecord = data.result;
        for (let i = 0; i < this.installmentRecord.length; i++) {
          this.completedFees += this.installmentRecord[i].thisInstallmentAmount;
        }
        this.moduleDetails.pendingFees[i] =
          this.moduleDetails.modulePrice[i] - this.completedFees;
        this.completedFees = 0;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  saveFeeEdit(newPendingFee: any, i: any): void {
    //has to be done in api itself..for time being kept in local ts file

    this.receiptService
      .editModulesPendingFees(
        this.studentId,
        newPendingFee,
        this.moduleDetails.moduleId[i]
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.moduleDetails.pendingFees[i] = data.user.modules[i].pendingFees;
          this.isfeesEditing = false;
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  editCourse: any;
  courseAccessValidity: { [courseName: string]: any } = {};

  editCourseAccess(course: string): void {
    this.editCourse = course;
    this.isEditing = true;
    // Initialize the access validity for the current course if it doesn't exist
    if (!this.courseAccessValidity.hasOwnProperty(course)) {
      this.courseAccessValidity[course] = this.accessValidTill;
    }
  }

  editModuleInstallment(module: string): void {
    this.editInstforModule = module;
    this.isInstEditing = true;

  }

  saveEditInst(newInst: Number): void {
    console.log(newInst);
    // add a course with installments in user database

    
    //api for writing into user of specific user id a new staticcourse
    this.isInstEditing = false;
  }

  cancelEditInst(): void {
    this.isInstEditing = false;
  }

  saveEdit(newAccess: any): void {
    this.courseAccessValidity[this.editCourse] = newAccess;
    this.isEditing = false;
  }
  cancelEdit(): void {
    this.isEditing = false;
    this.isInstEditing = false;
    this.isfeesEditing = false;
  }

  editInstallments(i: any): void {
    this.editforModule = i;
    this.editforModuleId = this.moduleDetails.moduleId[i];
    this.isInstEditing = true;
    console.log(this.editforModuleId);
    console.log(this.isInstEditing);
    // this.isInstEditing = true;
  }

  saveInstEdit(newInstallments: any, i: any): void {
    this.receiptService
      .updateModuleInstallments(
        this.studentId,
        newInstallments,
        this.editforModuleId
      )
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.moduleDetails.installments[i] =
            data.user.modules[i].installments;
          this.isInstEditing = false;
        },
        error: (err) => {
          console.log(err);
          this.isInstEditing = false;
        },
      });
  }

  enrollToStaticCourse(): void {
    this.getStaticCourses();
    this.displayTotalFees();
    console.log(this.studentId, 'enrolling');
    this.isopenModuleForm = true;
  }

  cancelInstEdit(): void {
    this.isInstEditing = false;
  }
}
