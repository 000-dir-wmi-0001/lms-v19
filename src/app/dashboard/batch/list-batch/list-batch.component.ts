import { Component, OnInit, OnDestroy } from '@angular/core';
import { BatchService, Batch } from '../../../services/batch.service';
import { BatchStateService } from '../../../services/batch-state.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CommonService } from '../../../services/common.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-batch',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './list-batch.component.html',
  styleUrl: './list-batch.component.css'
})
export class ListBatchComponent implements OnInit {
  // Array to hold the list of batches
  batches: Batch[] = [];
  // Variable to hold the currently selected batch for editing
  selectedBatch: Batch | null = null;
  // Array to manage all subscriptions for cleanup
  private subscriptions: Subscription[] = [];

  constructor(
    private batchService: BatchService, // Service to handle batch operations
    private batchStateService: BatchStateService, // Service to manage batch state
    private commonService: CommonService, // Common service for shared operations
    private router: Router, // Router service for navigation
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    // Fetch the initial list of batches
    this.fetchBatches();

    // Subscribe to batch state updates
    this.subscriptions.push(
      this.batchStateService.batches$.subscribe(
        (updatedBatches) => {
          this.batches = updatedBatches; // Update local list of batches
        },
        (error) => {
          console.error('Error in batch subscription:', error); // Log subscription error
        }
      )
    );

    // Subscribe to update batch events
    this.subscriptions.push(
      this.commonService.updateBatch.subscribe(
        (res) => {
          if (res) {
            this.fetchBatches(); // Refresh batch list on update event
          }
        },
        (error) => {
          console.error('Error in updateBatch subscription:', error); // Log error
        }
      )
    );
  }

  ngOnDestroy() {
    // Unsubscribe from all active subscriptions to prevent memory leaks
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  // Fetch the list of batches from the service
  fetchBatches() {
    this.batchService.getBatches('batches/list').subscribe({
      next: (data: Batch[]) => {
        if (data && Array.isArray(data)) {
          this.batches = data; // Update local list of batches
          this.batchStateService.updateBatches(data); // Update state with new batches
        } else {
          console.error('Invalid data format received:', data); // Log invalid data format
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

  // Handle edit batch operation
  onEdit(batch: Batch) {
    if (!batch) {
      console.error('Cannot edit undefined batch'); // Log error for undefined batch
      return;
    }

    this.selectedBatch = null; // Clear any existing selection
    this.selectedBatch = { ...batch }; // Set the selected batch for editing
    this.commonService.editBatch.next(this.selectedBatch); // Emit selected batch for editing
  }

  // Update the selected batch
  onUpdateBatch() {
    if (!this.selectedBatch) {
      console.error('No batch selected for update'); // Log error for no selection
      return;
    }

    if (!this.selectedBatch.name) {
      console.error('Batch name is required'); // Validate required field
      return;
    }

    this.batchService.updateBatch('batches/update', this.selectedBatch).subscribe(
      (updatedBatch) => {
        console.log('Batch updated successfully:', updatedBatch); // Log success
        this.fetchBatches(); // Refresh batch list
        this.selectedBatch = null; // Clear selected batch
      },
      (error) => {
        console.error('Error updating batch:', error); // Log error
        if (error.status === 500) {
          console.error('Server error details:', error.error); // Log server error details
        }
      }
    );
  }

  // Cancel the edit operation and clear the selection
  onCancelEdit() {
    this.selectedBatch = null;
  }

  // Handle delete operation for a batch
  onDelete(batchId: string) {
    if (!batchId) {
      console.error('Cannot delete batch with undefined ID'); // Log error for undefined ID
      return;
    }

    if (confirm('Are you sure you want to delete this batch?')) {
      this.batchService.deleteBatch('batches/delete', batchId).subscribe(
        () => {
          console.log('Batch deleted successfully'); // Log success
          this.fetchBatches(); // Refresh batch list
        },
        (error) => {
          console.error('Error deleting batch:', error); // Log error
          if (error.status === 500) {
            console.error('Server error details:', error.error); // Log server error details
          }
        }
      );
    }
  }

  // Navigate to the batch details page
  viewBatch(batchId: string) {
    console.log('View batch details:', batchId); // Log batch ID
    // this.router.navigate(['dashboard/batch/details/', batchId]); // Navigate to details page
    // this.router.navigate(['details']); // Navigate to details page
    this.router.navigate(['dashboard/batch/details/', batchId]); // Navigate to details page

  }
}

