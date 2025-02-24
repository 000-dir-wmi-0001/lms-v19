import { Component, OnInit } from '@angular/core';

import { StorageService } from '../../../../services/storage.service';
import { UserService } from '../../../../services/user.service';
import { CourseService } from '../../course.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-learnings',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './my-learnings.component.html',
  styleUrl: './my-learnings.component.css'
})
export class MyLearningsComponent implements OnInit {

  constructor(private courseService: CourseService, private storageService: StorageService, private _user: UserService) { }
  courses: any = []
  Courses: any = []
  token: any;
  userId: any;
  CurrentUser: any;
  course: any

  ngOnInit(): void {

    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id

    this._user.getUser(this.userId).subscribe({
      next: (userData: any) => {
        this.CurrentUser = userData;
        const userCourses = this.CurrentUser.user.courses;
        this.courses = [];

        // Fetch courses
        this.courseService.courses().subscribe({
          next: (data: any) => {
            const allCourses = data.courses;

            // Filter and fetch thumbnails for user courses
            for (let i = 0; i < userCourses.length; i++) {
              const courseId = userCourses[i];
              const course = allCourses.find((c: any) => c._id === courseId);

              if (course && course.thumbnail) {
                this.courseService.getThumbnail(course._id, course.thumbnail).subscribe({
                  next: (thumbnailData: any) => {
                    course.url = thumbnailData;
                    this.courses.push(course); // Add the course to the courses array
                  },
                  error: (err: any) => {
                  },
                });
              }
            }
          },
          error: (err: any) => {
          },
        });
      },
      error: (err: any) => {
      },
    });
  }

}
