import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StorageService } from '../../../../services/storage.service';
import { UserService } from '../../../../services/user.service';
import { CourseService } from '../../course.service';
// import { CourseService } from 'src/app/services/course.service';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  styleUrls: ['./course-list.component.css']
})

export class CourseListComponent implements OnInit {
  Course = {
    _id: "",
    name: "",
    thumbnail: "",
    url: ""
  }
  courses: any = [];
  modalRef!: BsModalRef;
  token: any;
  userId: any;
  CurrentUser: any;
  isLoading: boolean = true;
  isloading = false;


  filteredCourses: any[] = [];
  @ViewChild('searchBox') searchInput!: ElementRef<HTMLInputElement>;
  allCourses: any;
  constructor(public courseService: CourseService, private router: Router, private modalService: BsModalService, private storageService: StorageService, private _user: UserService) { }
  async viewCourse(courseId: string): Promise<void> {  // Add explicit return type
    try {
      this.courseService.setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await this.router.navigate([courseId]);
    } catch (error) {
      console.error('Error navigating to course:', error);
    } finally {
      this.courseService.setLoading(false);
    }

  }


  course: any = []

  url: any = []
  ngOnInit(): void {



    this.isLoading = true;
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id
    this.courseService.courses().subscribe({
      next: (data: any) => {
        console.log(data);
        this.isLoading = false;
        this.courses = data.courses;
        this.allCourses = data.courses;
        this.courses = this.courses.map((course: any) => {
          if (course.thumbnail) {
            this.courseService.getThumbnail(course._id, course.thumbnail).subscribe({
              next: (data1) => {
                course.url = data1;
                console.log(course.url);

              },
              error(err) {
              },
            });
          }
          return course;
        });
      },
      error(err) {
      },
    });


    const minDelay = new Promise(resolve => setTimeout(resolve, 2000));

    const courseData = this.courseService.courses().pipe(
      map((data: any) => {
        this.courses = data.courses;
        this.allCourses = data.courses;
        return this.courses.map((course: any) => {
          if (course.thumbnail) {
            this.courseService.getThumbnail(course._id, course.thumbnail).subscribe({
              next: (data1) => {
                course.url = data1;
              },
              error(err) {
                console.error('Error loading thumbnail:', err);
              },
            });
          }
          return course;
        });
      })
    );

    // Wait for both the minimum delay and data loading
    Promise.all([minDelay, firstValueFrom(courseData)]).then(() => {
      this.isLoading = false;
    }).catch(error => {
      console.error('Error loading courses:', error);
      this.isLoading = false;
    });




    this._user.getUser(this.userId).subscribe({
      next: (data: any) => {
        this.CurrentUser = data
        this.course = this.CurrentUser.user.courses;

      },
      error: (err) => {

      },
    })


  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  deleteCourse(courseId: any): void {
    this.modalRef.hide();
    this.isLoading = true;
    console.log(courseId);
    this.courseService.deleteCourse(courseId).subscribe(
      {
        next: (data: any) => {
          this.isLoading = false;
          this.successMsg();
          this.courses = this.courses.filter((course: { [x: string]: any; }) => course['_id'] != courseId);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg();
        }
      }
    );
  }


  cancel(): void {
    this.modalRef.hide();
  }

  public getRole() {
    return this.storageService.getRole();
  }

  public addToCart(courseId: any) {
    this.courseService.addToCart(courseId, this.userId).subscribe(
      {
        next: (data: any) => {
          console.log(data);
          this.router.navigate(["dashboard/course/cart"])
        },
        error: (err: any) => {
          console.log(err);
        }
      }
    )
  }



  public checkAccessibility(courseId: any) {
    if (this.course.indexOf(courseId) != -1) {
      return true;
    }
    return false;
  }

  searchQuery: string = '';
  shouldFilter: boolean = false;

  onSearch() {
    if (this.searchQuery) {
      this.shouldFilter = true;
      this.filteredCourses = this.allCourses.filter((course: any) =>
        course.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.courses = this.filteredCourses;
    } else {
      this.shouldFilter = false;
      this.courses = this.allCourses;
    }
  }

  resetFilter() {
    this.searchQuery = '';
    this.shouldFilter = false;
    this.courses = this.allCourses;
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Failed to delete course',
      text: 'An error occurred while processing. Please try again later.',
      customClass: { popup: 'swal-wide' },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'Course deleted Successfully',
      text: 'The Course has been deleted successfully.',
      customClass: { popup: 'swal-wide' },
    });
  }
}
