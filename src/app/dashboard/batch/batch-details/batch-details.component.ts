import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import {
  Batch,
  BatchService,
  BatchWithStudents,
} from '../../../services/batch.service';
import { UserService } from '../../../services/user.service';
import { CommonService } from '../../../services/common.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-batch-details',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './batch-details.component.html',
  styleUrl: './batch-details.component.css'
})
export class BatchDetailsComponent implements OnInit {
  batch!: Batch; // Using definite assignment assertion
  mainSearchTerm: string = ''; // Separate variable for main search box
  advancedSearchTerm: string = ''; // Separate variable for advanced search box
  searchResults: any[] = [];
  studentsDataList: any;
  batchStudents: any[] = [];
  addedUserList: any[] = [];
  batchId!: string; // Ensure batchId is always a string
  studentsInBatch: any[] = []; // To hold students from the batch
  searchModalOpen: boolean = false; // To control the modal visibility
  filteredStudents: any[] = []; // To hold the filtered student results
  startDate: any;
  endDate: any;
  moduleName: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private batchService: BatchService,
    private userService: UserService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((res: any) => {
      this.studentsDataList = res;
    });




    const batchId = this.route.snapshot.paramMap.get('name') as string; // Cast to string
    this.batchId = batchId;
    // console.log('Batch ID:', batchId);
    if (batchId) {
      this.getBatchDetails(batchId);
    } else {
      this.commonService.showError('Batch ID not provided');
    }
  }

  getBatchDetails(batchId: string) {
    this.batchService.getBatchById(`batches/details/${batchId}`).subscribe({
      next: (data: BatchWithStudents) => {
        console.log('Response from getBatchById:', data);
        console.log('Batch:', data.batch);
        if (data) {
          this.batch = data.batch;
          this.startDate = data.batch.startFrom;
          this.endDate = data.batch.endAt;
          this.moduleName = data.batch.module.moduleName;
          this.studentsInBatch = data.students;
          // console.log('Set batch to:', this.batch);
        } else {
          alert('Batch not found with the given ID');
        }
      },
      error: (error) => {
        console.error('Error fetching batch details: ', error);
        alert('Failed to fetch batch details');
      },
    });
  }

  onSearch(): void {
    this.searchResults = [];

    if (!this.mainSearchTerm.trim()) return; // Use mainSearchTerm

    this.searchResults = this.studentsDataList.filter((student: any) =>
      student.firstName.toLowerCase().includes(this.mainSearchTerm.toLowerCase())
    );

    if (this.batchStudents.length > 0) {
      this.searchResults = this.searchResults.filter(
        (student) => !this.batchStudents.includes(student._id)
      );
    }
  }

  onAdd(student: any): void {
    this.batchService.addStudentToBatch(this.batchId, student._id).subscribe({
      next: () => {
        this.addedUserList.push(student);
        this.batchStudents.push(student._id);
        this.searchResults = [];
        this.mainSearchTerm = ''; // Reset main search term
        alert('Student added to batch successfully');
        this.getBatchDetails(this.batchId);
      },
      error: (error) => {
        console.log(error);
        alert(error.error.message);
      },
    });
  }

  onDelete(student: any): void {
    this.batchService
      .removeStudentFromBatch(this.batchId, student._id)
      .subscribe(
        () => {
          // Update the frontend list of students after successful removal
          this.addedUserList = this.addedUserList.filter(
            (s) => s._id !== student._id
          );
          this.batchStudents = this.batchStudents.filter(
            (id) => id !== student._id
          );
          alert('Student removed from batch');

          this.getBatchDetails(this.batchId);
        },
        (error) => {
          console.error('Error removing student from batch:', error);
          alert('Failed to remove student from batch');
        }
      );
  }

  openSearchModal() {
    this.searchModalOpen = true; // Open the search modal
    this.advancedSearchTerm = ''; // Reset the advanced search term
    this.filteredStudents = []; // Clear the filtered students list
  }

  searchStudent() {
    if (!this.advancedSearchTerm.trim()) {
      this.filteredStudents = this.studentsInBatch; // Reset to all students if search term is empty
      return;
    }

    this.filteredStudents = this.studentsInBatch.filter((student: any) =>
      student.firstName.toLowerCase().includes(this.advancedSearchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(this.advancedSearchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(this.advancedSearchTerm.toLowerCase())
    );
  }

  meetingDetails(batchId: string) {
    this.router.navigate(['/dashboard/batch/meet', batchId]);
  }

}
