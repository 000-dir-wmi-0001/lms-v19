import { Component, OnInit } from '@angular/core';
import { CreateBatchComponent } from '../create-batch/create-batch.component';
import { ListBatchComponent } from '../list-batch/list-batch.component';
import { BatchDetailsComponent } from '../batch-details/batch-details.component';
import { BatchService, Batch, Module } from '../../../services/batch.service';
import { BatchStateService } from '../../../services/batch-state.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-batch',

  imports: [CreateBatchComponent, CommonModule],
  templateUrl: './batch.component.html',
  styleUrl: './batch.component.css'
})
export class BatchComponent implements OnInit {

  modules: Module[] = [];

  constructor(
    private batchService: BatchService, // Service to handle batch operations
    private commonService: CommonService, // Common service for shared operations
    private router: Router, // Router service for navigation
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {

    this.fetchBatches();

  }




  fetchBatches() {
    this.batchService.getAllModules('module/').subscribe({
      next: (data: any) => {
        if (data.modules && Array.isArray(data.modules)) {
          this.modules = data.modules; // Update local list of batches
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



  viewModule(moduleId: string) {
    this.router.navigate(['dashboard/batches/module-batch-list/', moduleId]); // Navigate to details page

  }
}
