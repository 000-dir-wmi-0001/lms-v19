import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';

import { forkJoin } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';

import { StorageService } from '../../../../services/storage.service';
import { UserService } from '../../../../services/user.service';
import { CourseService } from '../../course.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  selector: 'app-view-course',
  templateUrl: './view-course.component.html',
  styleUrls: ['./view-course.component.css'],
})
export class ViewCourseComponent implements OnInit {
  user: any;
  instructorId: any;
  courseId = 0;
  token: any;
  userId: any;
  modalRef: any;
  myCourses: any;
  CurrentUser: any;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private courseService: CourseService,
    private router: Router,
    private storageService: StorageService,
    private _user: UserService,
    private datePipe: DatePipe,
    private modalService: BsModalService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    this.courseId = this.route.snapshot.params['courseId'];
    this.getInstructorId();

    this._user.getUser(this.userId).subscribe({
      next: (userData: any) => {
        // this.isLoading = false;
        this.CurrentUser = userData;
        this.myCourses = this.CurrentUser.user.courses;
      },
    });

    if (this.getRole() == 'STUDENT') {
      this.getUserCourseInfo();
      //this.checkAccessibility();
    }
    this.getCourseLectures();
  }

  public getRole() {
    return this.storageService.getRole();
  }

  public getInstructorId() {
    this.courseService.getCourse(this.courseId).subscribe(
      //lectures()
      {
        next: (data: any) => {
          this.instructorId = data.course.instructor;
        },
        error: (_err) => { },
      }
    );
  }

  LectureIdList = [];

  public getCourseLectures() {
    this.courseService.getCourse(this.courseId).subscribe({
      next: (data: any) => {
        // this.isLoading = false;
        this.LectureIdList = data.course.lectures;
        this.loadLectureInfo();
      },
    });
  }

  currentTitle = '';
  currentDescription = '';
  currentStatus = '';
  currentLecture: any;
  currentLectureVideoUrl!: String;
  LectureInfo: any = [];

  public loadLectureInfo() {
    this.LectureInfo = [];
    // console.log("2")
    let lectureObservables = [];

    if (this.LectureIdList.length == 0) {
      this.isLoading = false;
    }
    for (var i = 0; i < this.LectureIdList.length; i++) {
      lectureObservables.push(
        this.courseService.getLecture(this.LectureIdList[i])
      );
    }

    forkJoin(lectureObservables).subscribe({
      next: (data: any[]) => {
        // console.log('2');
        for (var i = 0; i < data.length; i++) {
          if (data[i]) {
            const date = data[i].createdAt; // your date in UST
            const format = 'dd/MM/yyyy HH:mm:ss'; // your desired format
            const timezone = 'IST'; // your desired timezone

            const formattedDate = this.datePipe.transform(
              date,
              format,
              timezone
            );
            data[i].createdAt = formattedDate;
            this.LectureInfo.push(data[i]);
          }
        }
        // console.log('first ' + this.LectureInfo);
        this.isLoading = false;

        this.currentTitle = this.LectureInfo[0].title;
        this.currentDescription = this.LectureInfo[0].description;
        this.currentStatus = this.LectureInfo[0].status;
        this.LectureInfo.sort((a: any, b: any) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        if (this.LectureInfo.length > 0) {
          this.courseService
            .getVideo(
              this.courseId,
              this.LectureInfo[0]._id,
              this.LectureInfo[0].filename
            )
            .subscribe({
              next: (data: any) => {
                this.currentLectureVideoUrl = data;
              },
              error(err) { },
            });
        }
        this.isLoading = false;
      },
      error(err) { },
    });
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  cancel(): void {
    this.modalRef.hide();
  }

  setCurrentLectureVideoUrl(lecture: any) {
    const lid = lecture._id;
    const fileName = lecture.filename;
    this.courseService.getVideo(this.courseId, lid, fileName).subscribe({
      next: (data: any) => {
        this.currentLectureVideoUrl = data;
      },
      error(err) { },
    });
    this.currentTitle = lecture.title;
    (this.currentDescription = lecture.description),
      (this.currentStatus = lecture.status);
    this.currentLecture = lecture;
  }

  // get user information
  public getUserCourseInfo() {
    this._user.getUser(this.userId).subscribe({
      next: (data) => {
        this.user = data;
        this.course = this.user.user.courses;
      },
      error: (err) => { },
    });
  }

  course: any = [];

  public checkAccessibility(lecture: any) {
    if (this.course.indexOf(this.courseId) != -1 && lecture.status == 'Free') {
      return true;
    }
    return false;
  }

  public delete(id: any) {
    this.modalRef.hide();
    this.courseService.deleteLecture(id, this.courseId).subscribe({
      next: (data) => {
        this.successMsg();
        this.getCourseLectures();
      },
      error: (err) => {
        this.errorMsg();
      },
    });
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Error while deleting lecture',
      text: 'An error occurred while processing. Please try again later.',
      customClass: { popup: 'swal-wide' },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Lecture Deleted Successfully',
      text: 'The lecture has been deleted successfully.',
      customClass: { popup: 'swal-wide' },
    });
  }
}
