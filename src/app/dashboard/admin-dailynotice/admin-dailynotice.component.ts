import { Component, OnInit } from '@angular/core';
import { FollowUp } from '../../services/follow-up.service';  
import { NoticeService } from '../../services/notice.service'; 
import { StorageService } from '../../services/storage.service';
import { FollowUpService } from '../../services/follow-up.service';  
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dailynotice',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-dailynotice.component.html',
  styleUrl: './admin-dailynotice.component.css'
})
export class AdminDailynoticeComponent implements OnInit {
  notices: any[] = []; // Array to hold notices
  showForm = false; // Flag to show/hide the form
  currentNotice = { title: '', description: '', id: null }; // Current notice being edited
  userRole: any; // User role
  userId: any; // User ID
  token: any; // User token

  constructor(
    private noticeService: NoticeService,
    private storageService: StorageService,
    private followUpService: FollowUpService
  ) {}

  ngOnInit() {
    this.token = this.storageService.getToken();
    this.userRole = this.storageService.getRole();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id; // Decode user ID from token
    this.getNotices(); // Fetch notices on initialization

    // Subscribe to follow-up notifications
    this.followUpService.checkNotifications();
    this.followUpService.getNotificationObservable().subscribe((followUp: FollowUp | null) => {
      if (followUp) {
        this.notices.push({
          title: `Follow-Up Reminder: ${followUp.studentName}`,
          description: `Description: ${followUp.description}\nContact: ${followUp.mobileNo}`,
          date: followUp.date,
        });
      }
    });
  }

  // Fetch notices from the service
  getNotices() {
    this.noticeService.getNotices().subscribe(
      (notices) => this.notices = notices,
      (error) => console.error('Error fetching notices:', error)
    );
  }

  // Check if the user can edit a specific notice
  canEditNotice(notice: any): boolean {
    return (
      this.userRole === 'ADMIN' ||
      this.userRole === 'SUPERADMIN' ||
      (this.userRole === 'INSTRUCTOR' && notice.creatorId === this.userId)
    );
  }

  // Delete a notice
  deleteNotice(id: any) {
    const notice = this.notices.find((n) => n._id === id);
    if (notice && this.canEditNotice(notice)) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this notice?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          this.noticeService.deleteNotice(id).subscribe(
            () => {
              this.successMsg();
              this.getNotices(); // Refresh notices after deletion
            },
            (error) => {
              this.errorMsg();
              console.error('Error deleting notice:', error);
            }
          );
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You are not authorized to delete this notice.',
      });
    }
  }

  // Show the form to add a new notice
  showAddNoticeForm() {
    this.showForm = true;
    this.currentNotice = { title: '', description: '', id: null }; // Reset current notice
  }

  // Edit an existing notice
  editNotice(id: any) {
    const notice = this.notices.find((n) => n._id === id);
    if (notice && this.canEditNotice(notice)) {
      this.currentNotice = { title: notice.title, description: notice.description, id: notice._id };
      this.showForm = true; // Show form for editing
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Unauthorized',
        text: 'You are not authorized to edit this notice.',
      });
    }
  }

  // Save a notice (create or update)
  saveNotice() {
    if (this.currentNotice.id) {
      // Update existing notice
      const notice = this.notices.find((n) => n._id === this.currentNotice.id);
      if (notice && this.canEditNotice(notice)) {
        this.noticeService.updateNotice(
          this.currentNotice.id,
          this.userId,
          this.currentNotice.title,
          this.currentNotice.description
        ).subscribe(
          () => {
            this.getNotices();
            this.showForm = false;
            Swal.fire('Notice Updated', 'The notice has been updated successfully.', 'success');
          },
          (error) => {
            console.error('Error updating notice:', error);
            Swal.fire('Error', 'An error occurred while updating the notice. Please try again later.', 'error');
          }
        );
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Unauthorized',
          text: 'You are not authorized to update this notice.',
        });
      }
    } else {
      // Create new notice
      this.noticeService.addNotice(
        this.currentNotice.title,
        this.currentNotice.description,
        this.userId
      ).subscribe(
        () => {
          this.getNotices();
          this.showForm = false;
          Swal.fire('Notice Created', 'The notice has been created successfully.', 'success');
        },
        (error) => {
          console.error('Error creating notice:', error);
          Swal.fire('Error', 'An error occurred while creating the notice. Please try again later.', 'error');
        }
      );
    }
  }

  // Cancel editing
  cancelEdit() {
    this.showForm = false;
  }

  // Show error message for deletion failure
  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Error while deleting notice',
      text: 'An error occurred while processing. Please try again later.',
      customClass: {popup:'swal-wide'},
    });
  }

  // Show success message for successful deletion
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Notice Deleted Successfully',
      text: 'The notice has been deleted successfully.',
      customClass: {popup:'swal-wide'},
    });
  }
}