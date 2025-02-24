import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LiveClassService } from '../../../services/live-class.service';
import Swal from 'sweetalert2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stud-meeting',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './stud-meeting.component.html',
  styleUrl: './stud-meeting.component.css'
})
export class StudMeetingComponent implements OnInit {

  allMeetings: any = [];
  loading: boolean = true;
  constructor(
    private liveclassservice: LiveClassService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getMeetingsData()
  }

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

  joinMeeting(meetingId: string, password: string) {
    this.liveclassservice.setMeetingDetails(meetingId, password)
    this.router.navigate(['dashboard/Live-class/join-meeting'])
  }

}

