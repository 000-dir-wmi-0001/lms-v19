import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { BatchService } from '../../../services/batch.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-batch',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-batch.component.html',
  styleUrl: './user-batch.component.css'
})
export class UserBatchComponent implements OnInit {
  // Token to store the user's authentication token
  token: any;
  // User ID extracted from the token
  userId: any;
  // Holds the details of the user's batches
  batchDetails: any;

  constructor(
    private router: Router, // Router service for navigation
    private userService: UserService, // User service for user-related operations
    private storageService: StorageService, // Storage service for token and other data
    private batchService: BatchService // Batch service for batch-related operations
  ) { }

  ngOnInit(): void {
    // Retrieve the authentication token from storage
    this.token = this.storageService.getToken();

    // Decode the token to extract user ID
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;

    console.log("User Id", this.userId);

    // If the user ID is valid, fetch the user's batch details
    if (this.userId) {
      this.fetchBatchDetails();
    }
  }

  // Fetch batch details for the logged-in user
  fetchBatchDetails(): void {
    this.batchService.getUsersBatches(this.userId).subscribe({
      next: (response: any) => {
        console.log("Batches fetched successfully");
        // Store batch details from the response
        this.batchDetails = response.user.batches;
      },
      error: (error: any) => {
        // Show error message using SweetAlert
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to get batch details, please try again.',
        });
        console.error('Error fetching batches:', error);
      }
    });
  }

  // Navigate to a specific batch details page
  viewBatch(batchId: string): void {
    this.router.navigate(['/dashboard/batch/userbatches/stud', batchId]); // Navigate to batch details
    console.log("Batch ID", batchId); // Log batch ID for debugging
  }
}
