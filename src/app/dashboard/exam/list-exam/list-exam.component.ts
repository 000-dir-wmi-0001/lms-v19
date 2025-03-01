import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';

import { filter } from 'rxjs';

import { StorageService } from '../../../services/storage.service';
import { ExamService } from '../../../services/exam.service';
import { CourseService } from '../../course/course.service';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-exam',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterOutlet, RouterLink],
  templateUrl: './list-exam.component.html',
  styleUrl: './list-exam.component.css'
})

export class ListExamComponent implements OnInit, OnDestroy {
  search: any[] = [] // Store all exams
  filteredExams: any[] = []; // Store filtered exams based on search query
  // @ViewChild('searchExam') searchInput!: ElementRef<HTMLInputElement>;
  searchQuery: string = ''; // Store the search query
  allExams: any = [];

  startDate: any;
  exams: any[] = []; //all data is store
  data: any;
  isLoading = true;
  role: any
  setvalue = false;
  token: any
  userId: any
  checkIfAttempted: any
  startTime!: String;
  endTime!: String;


  constructor(private examservice: ExamService,
    private router: Router,
    private courseService: CourseService,
    private storageService: StorageService,
    private modalService: BsModalService,
  ) { }

  ngOnInit(): void {
    this.role = this.storageService.getRole();
    if (this.role == 'STUDENT') {
      this.setvalue = true;
    }

    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;



    this.examservice.getExams().subscribe({
      next: (data: any) => {
        // console.log("exam :");
        // console.log(data.exams);

        this.isLoading = false;
        this.exams = data.exams;
        this.filteredExams = this.exams;

      },
      error: (err: { error: { message: any; }; }) => {
        // Handle error
      }
    });

    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (
          event.id === 1 &&
          event.url === event.urlAfterRedirects
        ) {
          // Your code here for when the page is refreshed
        }
      });
  }


  ngOnDestroy(): void {
  }

  public IsValidDate(str: any) {
    var isValid = false;
    var t = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);

    if (t !== null) {
      isValid = true;
    }

    return isValid;
  }
  public getRole() {
    return this.storageService.getRole();
  }

  examDetails(exam: any, str: any) {

    this.router.navigate([`/dashboard/exam/${exam._id}/${exam.type}/${str}`,]);
  }

  parseTime(timeStr: string): Date {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const now = new Date();
    now.setHours(hours, minutes, 0, 0); // Set hours and minutes for the current date
    return now;
  }


  // attemptexam(exam: any, examId: any) {
  //   console.log("EID", examId)

  //   this.examservice.getMCQQuestions(examId).subscribe({
  //     next: (data: any) => {
  //       console.log("SET", data.examQuestions);

  //       const startTime1 = this.parseTime(data.examQuestions.startTime);
  //       console.log("S1", startTime1);

  //       const endTime1 = this.parseTime(data.examQuestions.endTime);
  //       console.log("E1", endTime1);

  //       // Convert Date objects to strings in desired format (e.g., ISO string)
  //       const startTimeString = startTime1.toISOString(); // or format it as needed
  //       const endTimeString = endTime1.toISOString(); // or format it as needed

  //       // Call setExamTimes with string parameters
  //       this.examservice.setExamTimes(startTimeString, endTimeString);
  //     }
  //   });

  //   this.examservice.checkAtteptedorNot(exam._id, this.userId).subscribe({
  //     next: (data: any) => {
  //       this.checkIfAttempted = data.attempted;
  //       if (this.checkIfAttempted === false)
  //         this.router.navigate([`/dashboard/exam/${exam._id}/${exam.type}/attempt`,]);
  //       else if (this.checkIfAttempted === true)
  //         this.router.navigate([`/dashboard/exam/display-marks/${this.userId}/${exam._id}`,]);
  //     },
  //     error: (err: { error: { message: any; }; }) => {
  //       // Handle error
  //     }
  //   });

  //   this.router.navigate([`/dashboard/exam/${exam._id}/${exam.type}/attempt`,]);
  // }
  // attemptexam(exam: any, examId: any) {
  //   console.log("Exam ID:", examId);

  //   // First, check if the student has already attempted the exam
  //   this.examservice.checkAtteptedorNot(examId, this.userId).subscribe({
  //     next: (data: any) => {
  //       console.log("Check Attempted Response:", data); // Log the entire response

  //       // Ensure you are accessing the correct property for attempted status
  //       if (data && typeof data.attempted === 'boolean') {
  //         this.checkIfAttempted = data.attempted; // Check if the exam was already attempted
  //         console.log("Attempted Status:", this.checkIfAttempted); // Log the status

  //         // If already attempted, show a message
  //         if (this.checkIfAttempted) {
  //           Swal.fire({
  //             icon: 'info',
  //             title: 'Already Attempted',
  //             text: 'You have already attempted this exam.',
  //           }).then(() => {
  //             this.router.navigate(['/exams']); // Navigate back to the exams page
  //           });
  //           return; // Exit the function
  //         }
  //       } else {
  //         console.error('Unexpected response structure:', data);
  //         Swal.fire({
  //           icon: 'error',
  //           title: 'Error',
  //           text: 'Unexpected response from the server while checking attempt status.',
  //         });
  //         return;
  //       }

  //       // If not already attempted, proceed to check the exam date and time
  //       this.examservice.getMCQQuestions(examId).subscribe({
  //         next: (data: any) => {
  //           const startTime = new Date(data.examQuestions.startTime); // Get the start time
  //           const endTime = new Date(data.examQuestions.endTime); // Get the end time
  //           const currentDate = new Date(); // Current date and time

  //           console.log("Exam Start Time:", startTime);
  //           console.log("Exam End Time:", endTime);
  //           console.log("Current Time:", currentDate);

  //           // Check if the exam's start time is in the future
  //           if (currentDate < startTime) {
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: 'You cannot access this exam yet. Please come back later.',
  //             }).then(() => {
  //               this.router.navigate(['/dashboard/exam']);
  //             });
  //             return;
  //           }

  //           // Check if the exam's end time is in the past
  //           if (currentDate > endTime) {
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: 'This exam has already ended.',
  //             }).then(() => {
  //               this.router.navigate(['/exams']);
  //             });
  //             return;
  //           }

  //           // Check if the current time is within the exam's scheduled time
  //           if (currentDate >= startTime && currentDate <= endTime) {
  //             // Set the exam times for navigation
  //             this.examservice.setExamTimes(startTime.toISOString(), endTime.toISOString());

  //             // Navigate to the exam attempt page
  //             this.router.navigate([`/dashboard/exam/${exam._id}/${exam.type}/attempt`]);
  //           } else {
  //             Swal.fire({
  //               icon: 'error',
  //               title: 'Error',
  //               text: 'You cannot attempt this exam at this time.',
  //             }).then(() => {
  //               this.router.navigate(['/dashboard/exam']);
  //             });
  //           }
  //         },
  //         error: (err: any) => {
  //           console.error('Error fetching exam questions:', err);
  //           // Display an error message to the user
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: 'An error occurred while fetching the exam questions. Please try again later.',
  //           });
  //         }
  //       });
  //     },
  //     error: (err: { error: { message: any; }; }) => {
  //       console.error('Error checking attempt status:', err);
  //       // Display an error message to the user
  //       Swal.fire({
  //         icon: 'error',
  //         title: 'Error',
  //         text: 'An error occurred while checking your attempt status. Please try again later.',
  //       });
  //     }
  //   });
  // }

  attemptexam(exam: any, examId: any) {
    // console.log("Exam ID:", examId);

    // First, check if the student has already attempted the exam
    this.examservice.checkAtteptedorNot(examId, this.userId).subscribe({
      next: (data: any) => {
        // console.log("Check Attempted Response:", data);

        if (data && typeof data.attempted === 'boolean') {
          this.checkIfAttempted = data.attempted;

          // If already attempted, show a message
          if (this.checkIfAttempted) {
            Swal.fire({
              icon: 'info',
              title: 'Already Attempted',
              text: 'You have already attempted this exam.',
            }).then(() => {
              this.router.navigate(['/exams']);
            });
            return; // Exit the function
          }
        } else {
          console.error('Unexpected response structure:', data);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unexpected response from the server while checking attempt status.',
          });
          return;
        }

        // If not already attempted, proceed to check the exam date and time
        this.examservice.getMCQQuestions(examId).subscribe({
          next: (data: any) => {
            // console.log("Full Response from API:", data);


            const startTime = new Date(data.examQuestions.startTime); // Get the start time
            const endTime = new Date(data.examQuestions.endTime); // Get the end time
            const currentDate = new Date(); // Current date and time


            console.log("Start Time:", startTime);
            console.log("End Time:", endTime);
            console.log("Current Time:", currentDate);
            this.router.navigate([`/dashboard/exam/${exam._id}/${exam.type}/attempt`]);

            // Check if the current time is before the exam start time
            /*             if (currentDate < startTime) {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'You cannot access this exam yet. Please come back later.',
                          }).then(() => {
                            this.router.navigate(['/dashboard/exam']);
                          });
                          return;
                        }

                        // Check if the current time is after the exam end time
                        // if (currentDate > endTime) {
                        //   Swal.fire({
                        //     icon: 'error',
                        //     title: 'Error',
                        //     text: 'This exam has already ended.',
                        //   }).then(() => {
                        //     this.router.navigate(['/exams']);
                        //   });
                        //   return;
                        // }

                        // If the current time is within the exam's scheduled time
                        if (currentDate >= startTime && currentDate <= endTime) {
                          // Set the exam times for navigation
                          this.examservice.setExamTimes(startTime.toISOString(), endTime.toISOString());

                          // Navigate to the exam attempt page
                          this.router.navigate([`/dashboard/exam/${exam._id}/${exam.type}/attempt`]);
                        } else {
                          Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'You cannot attempt this exam at this time.',
                          }).then(() => {
                            this.router.navigate(['/dashboard/exam']);
                          });
                        }
                      },
                      error: (err: any) => {
                        console.error('Error fetching exam questions:', err);
                        Swal.fire({
                          icon: 'error',
                          title: 'Error',
                          text: 'An error occurred while fetching the exam questions. Please try again later.',
                        }); */
          }
        });
      },
      error: (err: { error: { message: any; }; }) => {
        console.error('Error checking attempt status:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'An error occurred while checking your attempt status. Please try again later.',
        });
      }
    });
  }




  attemptCODINGexam(exam: any) {
    this.router.navigate([`/dashboard/exam/compiler/attempt-exam/${exam._id}`,]);
  }
  attemptVERBALexam(exam: any) {
    this.router.navigate([`/dashboard/exam/verbal/attempt-exam/${exam._id}`,]);
  }

  deleteExam(examId: any) {
    this.examservice.deleteExam(examId).subscribe(
      {
        next: (data: any) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: { popup: 'swal-wide' },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'Exam Deleted successfully',
          });

          this.ngOnInit();
        },
        error: (err: { error: { message: any; }; }) => {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            customClass: { popup: 'swal-wide' },
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'error',
            title: 'Failed to delete exam',
          });
        }
      }
    )
  }

  gotocheckVerbalresult(examid: any) {
    this.router.navigate([`/dashboard/exam/verbalResult/${examid}`,]);
  }

  @HostListener('window:beforeunload', ['$event'])
  onWindowClose(event: Event) {
  }

  onSearch(): void {
    console.log("searching starts with ngOnchange");
    if (this.searchQuery.trim()) {
      console.log(this.searchQuery.trim());
      this.filteredExams = this.exams.filter(exam =>
        exam.course?.name?.toLowerCase().includes(this.searchQuery.trim().toLowerCase())
      );
      console.log(this.filteredExams);
    } else {
      this.filteredExams = this.exams; // Reset to all exams when search query is empty
    }
    console.log("searching ends", this.filteredExams);
  }




}


