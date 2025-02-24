import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, UntypedFormGroup, Validators, UntypedFormBuilder, FormsModule, } from '@angular/forms';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap'
import { LiveClassService } from '../../../services/live-class.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meeting',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './meeting.component.html',
  styleUrl: './meeting.component.css'
})
export class MeetingComponent implements OnInit {
  @ViewChild('createMeetingModal', { static: false }) createMeetingModal!: ElementRef;

  createMeetForm: UntypedFormGroup;
  allMeetings: any = [];
  setValue: boolean = false;
  private modalInstance: bootstrap.Modal | undefined;
  loading: boolean = true; // Set loading to true initially


  constructor(private formBuilder: UntypedFormBuilder, private liveclassservice: LiveClassService, private router: Router) {
    this.createMeetForm = this.formBuilder.group({
      topic: ['', Validators.required],
      type: [2], // Default value of 2 for Scheduled Meeting
      start_time: ['', Validators.required],
      duration: [0, Validators.required],
      timezone: ['', Validators.required],
      agenda: ['']
    });
  }


  ngOnInit(): void {
    this.getMeetingsData();

  }
  openModal() {
    this.modalInstance = new bootstrap.Modal(this.createMeetingModal.nativeElement);
    this.modalInstance.show();
  }

  /* closeModal() {
    if (this.modalInstance) {
      this.modalInstance.hide(); // Use Bootstrap's hide method to close the modal
    }else {
      console.warn("Modal instance is not available");
    }
  } */
  getMeetingsData() {
    this.liveclassservice.getAllMeetings().subscribe({
      next: (response: any) => {
        this.allMeetings = response
        this.allMeetings.reverse();

        console.log("all Meetings", this.allMeetings);
        this.loading = false;
      },
      error: (error: any) => {
        this.loading = false;
        const errorMessage = error.error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMessage,
          showConfirmButton: true
        });
      }
    });
  }



  createMeeting() {
    if (this.createMeetForm.valid) {
      const meetingData = this.createMeetForm.value;
      this.liveclassservice.createMeeting(meetingData).subscribe({
        next: (response: any) => {
          this.allMeetings.unshift(response)
          Swal.fire({
            icon: 'success',
            title: 'Meeting Created',
            text: 'Your meeting has been successfully created!',
            showConfirmButton: true,
            timer: 4000
          });
          this.getMeetingsData()


          console.log('Meeting created successfully:', response.response);
          this.createMeetForm.reset();


        },
        error: (error: any) => {
          const errorMessage = error.error ? error.error.details : 'An error occurred while creating the meeting.';
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: errorMessage,
            showConfirmButton: true
          });
          console.error('Error creating meeting:', error);
        }
      });
    } else {
      console.log('Form is invalid!');
    }
  }

  deleteMeeting(meeting_Id: Number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.liveclassservice.deleteMeeting(meeting_Id).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'Your meeting has been deleted.',
              timer: 2000
            });


            this.getMeetingsData();
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to delete the meeting. Please try again.',
            });
            console.error('Error deleting meeting:', error);
          }
        });
      }
    });
  }

  startMeeting(meetingId: string, password: string) {

    this.liveclassservice.setMeetingDetails(meetingId, password)
    console.log(meetingId, password, "logged")
    // Navigate to the HostComponent a

    this.router.navigate(['dashboard/Live-class/start-meeting'], {
      queryParams: { meetingId: meetingId, password: password }
    });
  }

}

