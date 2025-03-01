
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { BatchService, Batch } from '../../../services/batch.service';
import { BatchStateService } from '../../../services/batch-state.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
declare var bootstrap: any;

@Component({
  selector: 'app-list-batch',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './list-batch.component.html',
  styleUrls: ['./list-batch.component.css']
})
export class ListBatchComponent implements OnInit, OnDestroy {
  // Array to hold the list of batches
  batches: Batch[] = [];
  // Variable to hold the currently selected batch for editing
  selectedBatch: Batch | null = null;
  // Array to manage all subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  list_visble: boolean = true;

  // Properties for batch data
  batchId: string = '';
  batchData = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    moduleId: ''
  };

  isEditMode = true;  // Since we are updating, this is true

  _moduleId: string = '';

  constructor(
    private batchService: BatchService, // Service to handle batch operations
    private batchStateService: BatchStateService, // Service to manage batch state
    private commonService: CommonService, // Common service for shared operations
    private router: Router, // Router service for navigation
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    const moduleId = this.activatedRoute.snapshot.paramMap.get('id') as string; // Get moduleId from URL
    this._moduleId = moduleId;
    this.fetchBatches();
  }

  ngOnDestroy() {
    // Unsubscribe from all active subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Fetch the list of batches from the service
  fetchBatches() {
    this.batchService.getBatches(`batches/list/${this._moduleId}`).subscribe({
      next: (data: Batch[]) => {
        if (data && Array.isArray(data)) {
          this.batches = data;
        } else {
          console.error('Invalid data format received:', data);
          this.commonService.showError('Invalid data format received from server');
        }
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Failed to fetch batches';
        console.error('Error fetching batches:', errorMessage);
        this.commonService.showError(errorMessage);
      },
    });
  }

  // Handle edit batch operation
  onEdit(batch: Batch) {
    if (!batch) {
      console.error('Cannot edit undefined batch');
      return;
    }
    this.selectedBatch = { ...batch };
    this.list_visble = false;
  }

  // Cancel the edit operation and clear the selection
  onCancelEdit() {
    this.selectedBatch = null;
    this.list_visble = true;
  }

  // Save changes after editing the batch
  // saveChanges() {
  //   if (this.selectedBatch) {
  //     const updatedBatch: Batch = {
  //       ...this.selectedBatch,
  //       startFrom: this.selectedBatch.startFrom || this.selectedBatch.startFrom,
  //       endAt: this.selectedBatch.endAt || this.selectedBatch.endAt,
  //     };

  //     this.batchService.updateBatchOfModule(`batches/update/${updatedBatch._id}`, updatedBatch).subscribe(
  //       () => {
  //         console.log('Batch updated successfully');
  //         this.fetchBatches(); // Refresh batch list
  //         this.onCancelEdit(); // Close edit mode
  //       },
  //       (error) => {
  //         console.error('Error updating batch:', error);
  //         this.commonService.showError('Failed to update batch');
  //       }
  //     );
  //   }
  // }


  saveChanges() {
    if (this.selectedBatch) {
      const updatedBatch: Batch = {
        ...this.selectedBatch,
        // Convert dates to Date objects, but keep the unchanged ones as they are
        startFrom: this.selectedBatch.startFrom ? new Date(this.selectedBatch.startFrom) : this.selectedBatch.startFrom,
        endAt: this.selectedBatch.endAt ? new Date(this.selectedBatch.endAt) : this.selectedBatch.endAt,
      };

      this.batchService.updateBatchOfModule(`batches/update`, updatedBatch).subscribe(
        () => {
          console.log('Batch updated successfully');
          this.fetchBatches(); // Refresh batch list
          this.onCancelEdit(); // Close edit mode
        },
        (error) => {
          console.error('Error updating batch:', error);
          this.commonService.showError('Failed to update batch');
        }
      );
    }
  }


  // Handle delete operation for a batch
  onDelete(batchId: string) {
    if (!batchId) {
      console.error('Cannot delete batch with undefined ID');
      return;
    }

    if (confirm('Are you sure you want to delete this batch?')) {
      this.batchService.deleteBatch('batches/delete', batchId).subscribe(
        () => {
          console.log('Batch deleted successfully');
          this.fetchBatches(); // Refresh batch list
        },
        (error) => {
          console.error('Error deleting batch:', error);
          if (error.status === 500) {
            console.error('Server error details:', error.error);
          }
        }
      );
    }
  }

  // Navigate to the batch details page
  viewBatch(batchId: string) {
    this.router.navigate(['dashboard/batch/details/', batchId]); // Navigate to details page
  }

  // Navigate back to the batch list page
  backToBatch() {
    this.router.navigate(['dashboard']); // Navigate away temporarily
    setTimeout(() => {
      this.router.navigate(['dashboard/batch']); // Navigate back to the batch page
    }, 0); // You can adjust the timeout duration if necessary
  }
}


// import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
// import { BatchService, Batch } from '../../../services/batch.service';
// import { BatchStateService } from '../../../services/batch-state.service';
// import { BehaviorSubject, Subscription } from 'rxjs';
// import { CommonService } from '../../../services/common.service';
// import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
// import { CommonModule, DatePipe } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// declare var bootstrap: any;

// @Component({
//   selector: 'app-list-batch',
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
//   templateUrl: './list-batch.component.html',
//   styleUrls: ['./list-batch.component.css']
// })
// export class ListBatchComponent implements OnInit, OnDestroy {
//   // Array to hold the list of batches
//   batches: Batch[] = [];
//   // Variable to hold the currently selected batch for editing
//   selectedBatch: Batch | null = null;
//   // Array to manage all subscriptions for cleanup
//   private subscriptions: Subscription[] = [];

//   list_visble: boolean = true;

//   // Properties for batch data
//   batchId: string = '';
//   batchData = {
//     name: '',
//     description: '',
//     startDate: '',
//     endDate: '',
//     moduleId: ''
//   };

//   isEditMode = true;  // Since we are updating, this is true

//   _moduleId: string = '';

//   constructor(
//     private batchService: BatchService, // Service to handle batch operations
//     private batchStateService: BatchStateService, // Service to manage batch state
//     private commonService: CommonService, // Common service for shared operations
//     private router: Router, // Router service for navigation
//     private activatedRoute: ActivatedRoute,

//   ) { }

//   ngOnInit() {
//     const moduleId = this.activatedRoute.snapshot.paramMap.get('id') as string; // Get moduleId from URL
//     this._moduleId = moduleId;


//     // if (moduleId) {
//     this.fetchBatches();
//     // }
//   }

//   ngOnDestroy() {
//     // Unsubscribe from all active subscriptions to prevent memory leaks
//     this.subscriptions.forEach((sub) => sub.unsubscribe());
//   }

//   // Fetch the list of batches from the service
//   fetchBatches() {
//     this.batchService.getBatches(`batches/list/${this._moduleId}`).subscribe({
//       next: (data: Batch[]) => {
//         if (data && Array.isArray(data)) {
//           this.batches = data;
//         } else {
//           console.error('Invalid data format received:', data);
//           this.commonService.showError('Invalid data format received from server');
//         }
//       },
//       error: (error) => {
//         const errorMessage = error.error?.message || 'Failed to fetch batches';
//         console.error('Error fetching batches:', errorMessage);
//         this.commonService.showError(errorMessage);
//       },
//     });
//   }

//   // Handle edit batch operation
//   onEdit(batch: Batch) {
//     if (!batch) {
//       console.error('Cannot edit undefined batch');
//       return;
//     }
//     this.selectedBatch = { ...batch };

//     this.list_visble = false;
//   }

//   // Cancel the edit operation and clear the selection
//   onCancelEdit() {
//     this.selectedBatch = null;
//     this.list_visble = true;
//   }

//   // Handle delete operation for a batch
//   onDelete(batchId: string) {
//     if (!batchId) {
//       console.error('Cannot delete batch with undefined ID');
//       return;
//     }

//     if (confirm('Are you sure you want to delete this batch?')) {
//       this.batchService.deleteBatch('batches/delete', batchId).subscribe(
//         () => {
//           console.log('Batch deleted successfully');
//           this.fetchBatches(); // Refresh batch list
//         },
//         (error) => {
//           console.error('Error deleting batch:', error);
//           if (error.status === 500) {
//             console.error('Server error details:', error.error);
//           }
//         }
//       );
//     }
//   }

//   // Navigate to the batch details page
//   viewBatch(batchId: string) {
//     this.router.navigate(['dashboard/batch/details/', batchId]); // Navigate to details page
//   }

//   // Navigate back to the batch list page
//   backToBatch() {
//     this.router.navigate(['dashboard']); // Navigate away temporarily
//     setTimeout(() => {
//       this.router.navigate(['dashboard/batch']); // Navigate back to the batch page
//     }, 0); // You can adjust the timeout duration if necessary
//   }

// }
