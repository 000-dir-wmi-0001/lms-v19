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
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';

import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FeeService } from '../../services/fee.service';

import { StorageService } from '../../services/storage.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReceiptService } from '../../services/receipt.service';
import { provideHttpClient } from '@angular/common/http';
import { CourseEditFeeComponent } from "../fee/course-edit-fee/course-edit-fee.component";
import { BatchService, Module } from '../../services/batch.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'app-module',
  imports: [CommonModule, RouterLink, RouterOutlet, ReactiveFormsModule, FormsModule],
  templateUrl: './module.component.html',
  styleUrl: './module.component.css'
})
export class ModuleComponent {
  modulesList: Module[] = [];
  commonService: any;


  constructor(private _userService: UserService, private _storageService: StorageService, router: Router, private batchService: BatchService, commonService: CommonService) { }

  ngOnInit(): void {
    this.fetchModules();
  }


  fetchModules() {
    this.batchService.getAllModules('module/').subscribe({
      next: (data: any) => {
        if (data.modules && Array.isArray(data.modules)) {
          this.modulesList = data.modules; // Update local list of batches
        } else {
          // console.error('Invalid data format received:', data); // Log invalid data format
          this.commonService.showError('Invalid data format received from server'); // Show error notification
        }
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Failed to fetch batches'; // Get error message
        console.error('Error fetching batches:', errorMessage); // Log error
        this.commonService.showError(errorMessage); // Show error notification
      },
    });
  }

}
