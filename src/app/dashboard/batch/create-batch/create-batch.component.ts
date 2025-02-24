import { UserService } from '../../../services/user.service';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BatchService, Batch } from '../../../services/batch.service';
import { Router } from '@angular/router';
import { BatchStateService } from '../../../services/batch-state.service';
import * as bootstrap from 'bootstrap';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-batch',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-batch.component.html',
  styleUrl: './create-batch.component.css'
})
export class CreateBatchComponent {
  // Reference to the batch modal element in the template
  @ViewChild('batchModal') batchModalRef!: ElementRef;

  // Properties for batch name and description inputs
  batchName: string = '';
  batchDescription: string = '';

  // Properties for search functionality
  searchTerm: string = '';
  searchResults: any[] = [];

  // Flags and state for edit mode and batch data
  isEditMode = false;
  batchData = { name: '', description: '' };
  private modalInstance: any; // Modal instance for Bootstrap modal
  currentBatchData: any; // Data of the batch currently being edited

  // Array to store batches, initialized to prevent undefined error
  batches: Batch[] = [];

  // Dependency injection of required services
  constructor(
    private batchService: BatchService,
    private batchStateService: BatchStateService,
    private router: Router,
    private commonService: CommonService,
    private userService: UserService
  ) { }

  // Lifecycle hook to initialize component and load data
  ngOnInit(): void {
    // Load all batches on component initialization
    this.batchService.getBatches('batches/list').subscribe({
      next: (data) => {
        if (data) { // Null check for data
          this.batches = data;
          this.batchStateService.updateBatches(data); // Update state service with fetched batches
        }
      },
      error: (error) => {
        console.error('Error fetching batches:', error);
      }
    });

    // Subscribe to edit batch event from common service
    this.commonService.editBatch.subscribe({
      next: (res) => {
        if (res != null) {
          console.log(res);
          this.currentBatchData = res;
          this.batchData = {
            name: res.name,
            description: res.description
          };
          this.openBatchModal(true, this.batchData); // Open modal in edit mode
        }
      },
      error: (error) => {
        console.error('Error in edit batch subscription:', error);
      }
    });
  }

  // Method to open the batch modal
  openBatchModal(editMode: boolean, batch?: any): void {
    try {
      this.isEditMode = editMode; // Set edit mode flag
      if (editMode && batch) {
        this.batchData = { ...batch }; // Populate batch data for editing
      } else {
        this.batchData = { name: '', description: '' }; // Clear data for adding a new batch
      }
      this.modalInstance = new bootstrap.Modal(this.batchModalRef.nativeElement); // Initialize modal instance
      this.modalInstance.show(); // Show the modal
    } catch (error) {
      console.error('Error opening modal:', error);
    }
  }

  // Method to handle form submission for adding or editing a batch
  onSubmitBatch(): void {
    if (!this.batchData.name || !this.batchData.description) {
      console.error('Batch name and description are required');
      return;
    }

    if (this.isEditMode) {
      // Edit mode logic
      if (!this.currentBatchData) {
        console.error('No batch selected for editing');
        return;
      }
      this.currentBatchData.name = this.batchData.name;
      this.currentBatchData.description = this.batchData.description;

      // Update the batch through the service
      this.batchService.updateBatch('batches/update', this.currentBatchData).subscribe({
        next: (updatedBatch) => {
          console.log('Batch updated successfully:', updatedBatch);
          this.commonService.updateBatch.next(true); // Notify about the update
          this.currentBatchData = {}; // Reset current batch data
          this.batchData = { name: '', description: '' }; // Reset form data
        },
        error: (error) => {
          console.error('Error updating batch:', error);
        }
      });
    } else {
      // Add mode logic
      this.upsertBatch(this.batchData);
    }
    this.modalInstance?.hide(); // Hide modal after submission
  }

  // Helper method to add a new batch
  upsertBatch(batchData: any) {
    if (!batchData || !batchData.name || !batchData.description) {
      console.error('Invalid batch data');
      return;
    }

    const newBatch: Batch = {
      name: batchData.name,
      description: batchData.description,
    };

    // Add the batch through the service
    this.batchService.addBatch('batches/create', newBatch).subscribe({
      next: (response) => {
        if (response && response.batch) { // Null check for response
          console.log('Batch created successfully:', response);
          const createdBatch = response.batch;
          this.batchStateService.addBatch(createdBatch); // Add to state service
          this.batchName = '';
          this.batchDescription = ''; // Clear form inputs
          this.router.navigate(['/dashboard/batch']); // Navigate to batch dashboard
        } else {
          console.error('Invalid response format');
        }
      },
      error: (error) => {
        console.error('Error creating batch:', error);
      }
    });
  }

  // Method to handle search functionality
  onSearch(): void {
    this.searchResults = []; // Reset search results

    if (!this.searchTerm?.trim()) return; // Null and whitespace check for searchTerm

    // Filter batches based on the search term
    this.searchResults = this.batches.filter((batch: any) =>
      batch?.name?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    console.log(this.searchResults);
  }
}
