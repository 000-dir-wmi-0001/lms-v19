import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ReactiveFormsModule, FormControl, UntypedFormGroup, Validators, UntypedFormBuilder, FormsModule, } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as bootstrap from 'bootstrap'
import { LiveClassService } from '../../../services/live-class.service';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-meetings',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './meetings.component.html',
  styleUrl: './meetings.component.css'
})
export class MeetingsComponent implements OnInit {
  @ViewChild('createMeetingModal', { static: false }) createMeetingModal!: ElementRef;

  createMeetForm: UntypedFormGroup;
  meetingToEdit: any = null;
  allMeetings: any = [];
  isEditMode: boolean = false;
  editingMeetingId!: number;
  batchId!: string; // Ensure batchId is always a string
  setValue: boolean = false;
  private modalInstance: bootstrap.Modal | undefined;
  loading: boolean = true; // Set loading to true initially


  constructor(private formBuilder: UntypedFormBuilder, private liveclassservice: LiveClassService, private router: Router, private activateroute: ActivatedRoute) {
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
    this.batchId = this.activateroute.snapshot.paramMap.get('id') as string;
    console.log('Retrieved Batch ID:', this.batchId);
    this.getMeetingsData();

  }
  openModal(isEdit: boolean = false, meetingData: any = null) {
    this.isEditMode = isEdit;  // Set the mode to edit or create
    this.meetingToEdit = meetingData;  // Set the meeting to edit if needed

    if (isEdit && meetingData) {
      // If editing, populate the form with the existing meeting data
      this.createMeetForm.patchValue(meetingData);
    } else {
      // If creating, reset the form
      this.createMeetForm.reset();
    }
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
    this.liveclassservice.getAllMeetings(this.batchId).subscribe({
      next: (response: any) => {
        this.allMeetings = response
        //this.allMeetings.reverse();

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



  createOrUpdateMeeting() {
    if (this.createMeetForm.valid) {
      const meetingData = {
        ...this.createMeetForm.value,
        batchId: this.batchId
      };

      if (this.isEditMode && this.editingMeetingId) {
        this.liveclassservice.updateMeeting(this.editingMeetingId, meetingData).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Meeting Updated',
              text: 'Your meeting has been successfully updated!',
              timer: 4000
            });
            this.getMeetingsData();
            this.resetForm();
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to update the meeting.',
              showConfirmButton: true
            });
          }
        });
      } else {
        this.liveclassservice.createMeeting(meetingData).subscribe({
          next: (response: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Meeting Created',
              text: 'Your meeting has been successfully created!',
              timer: 4000
            });
            this.getMeetingsData();
            this.resetForm();
          },
          error: (error: any) => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occurred while creating the meeting.',
              showConfirmButton: true
            });
          }
        });
      }
    }
  }
  editMeeting(meetingId: number) {
    this.isEditMode = true;
    this.editingMeetingId = meetingId;

    const meetingToEdit = this.allMeetings.find((meet: any) => meet.meeting_Id === meetingId);
    if (meetingToEdit) {
      this.createMeetForm.patchValue({
        topic: meetingToEdit.topic,
        start_time: meetingToEdit.start_time,
        duration: meetingToEdit.duration,
        timezone: meetingToEdit.timezone,
        agenda: meetingToEdit.agenda
      });
      if (meetingToEdit) {
        this.openModal(true, meetingToEdit); // Open modal in edit mode
      }
    }
  }

  resetForm() {
    this.createMeetForm.reset();
    this.isEditMode = false;

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
  };

  /* Ed */

  startMeeting(meetingId: string, password: string) {

    /*     this.liveclassservice.setMeetingDetails(meetingId,password)
        console.log(meetingId, password, "logged")
        // Navigate to the HostComponent a

        this.router.navigate(['/dashboard/batch/start-meeting'], {
          queryParams: { meetingId: meetingId, password: password }
        }); */
    this.router.navigate(['/dashboard/batch/start-meeting', meetingId, password])
  }
}
