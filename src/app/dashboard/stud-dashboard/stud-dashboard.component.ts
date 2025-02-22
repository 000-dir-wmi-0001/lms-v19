import { Component, OnInit } from '@angular/core';
import { UserListComponent } from './../user/user-list/user-list.component';
import { StorageService } from '../../services/storage.service';
import { NoticeService } from '../../services/notice.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-stud-dashboard',
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './stud-dashboard.component.html',
  styleUrl: './stud-dashboard.component.css'
})
export class StudDashboardComponent implements OnInit {

  topNotices: any[] = [];

  constructor(
    private noticeService: NoticeService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.getTopNotices();
  }

  getTopNotices() {
    this.noticeService.getNotices().subscribe(
      (notices) => {
        // Sort by most recent and take top 3 notices
        this.topNotices = notices
          .sort((a: any, b: any) => {
            // Sort by most recent first
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .slice(0, 3);  // Get only top 3
      },
      (error) => {
        console.error('Error fetching notices:', error);
      }
    );
  }
  instructors: any[] = [];
  getAllInstructors(): void {
    this.userService.getInstructors().subscribe({
      next: (data) => {
        this.instructors = data.map((instructor: any) => {
          instructor.profileImageUrl = this.userService.getProfilePhoto(instructor.profileImage);
          return instructor;
        });
      },
      error: (err) => {
        console.error('Error fetching instructors:', err);
      }
    });
  }
}
