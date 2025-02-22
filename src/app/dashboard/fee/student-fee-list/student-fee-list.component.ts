import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FeeService } from '../../../services/fee.service';

import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../../services/receipt.service';
@Component({
  selector: 'app-student-feeList',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student-fee-list.component.html',
  styleUrls: ['./student-fee-list.component.css'],
})
export class FeeListComponent implements OnInit {
  name: any;
  studentList: any = [];
  isLoading = true;
  // modalRef!: BsModalRef;
  bsModalRef!: import('ngx-bootstrap/modal').BsModalRef<unknown>;
  msgText: any;
  toWAnumber: any;
  listTitles = [
    { name: 'index' },
    { name: 'studentName' },
    // { name: 'Mobile no. '},
    // { name: 'totalFee' },
    // { name: 'pendingFee' },
    { name: 'Details' },
    { name: 'Action' },
  ];

  constructor(
    private feeService: FeeService,
    private storageService: StorageService,
    private modalService: BsModalService,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getStudents();
  }
  getStudents() {
    this.feeService.getStudentUser().subscribe({
      next: (data: any) => {
        this.isLoading = false;
        this.studentList = data.studentUsers;
        console.log("data", data.studentUsers);
        console.log("thisone", this.studentList);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  handleDoubleClick(i: any) {
    this.router.navigate(['/dashboard/fee/displayStudentInfo/', i])
  }

  searchStudent() {
    if (!this.name) {
      this.getStudents();
    } else {
      this.studentList = this.studentList.filter((student: any) => {
        console.log(student)
        return student.user?.firstName?.toLowerCase().includes(this.name.toLowerCase())
      }
      );
    }
  }

  editFee(id: any) {
    console.log(id);
    this.router.navigate(['dashboard/fee/edit', id]);
  }

  writeReminderMsg(template: TemplateRef<any>, id: any) {
    this.bsModalRef = this.modalService.show(template);
    this.userService.getUser(id).subscribe({
      next: (data: any) => {
        this.toWAnumber = data.user.mobileno;
        console.log(this.toWAnumber);

      },
      error: (err) => {
        console.log(err)
      }
    })
  }

  sendReminder(text: any) {
    this.msgText = text;
    const whatsappUrl = `https://wa.me/${this.toWAnumber}?text=${encodeURIComponent(this.msgText)}`;
    // Redirect the user to the WhatsApp URL
    window.location.href = whatsappUrl;
  }
}
