import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { BatchService } from '../../../services/batch.service';
import { LiveClassService } from '../../../services/live-class.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stud-meet',
  imports: [CommonModule, FormsModule],
  templateUrl: './stud-meet.component.html',
  styleUrl: './stud-meet.component.css'
})
export class StudMeetComponent implements OnInit {

  allMeetings: any = [];
  loading: boolean = true;
  batchId!: string

  constructor(private userService: UserService,
    private storageService: StorageService,
    private batchService: BatchService,
    private activateroute: ActivatedRoute,
    private liveclassservice: LiveClassService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.batchId = this.activateroute.snapshot.paramMap.get('id') as string;
    console.log('Retrieved Batch ID from Student Meetings', this.batchId);
    this.getMeetingsData()
  }

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

  joinMeeting(meetingId: string, password: string) {
    this.liveclassservice.setMeetingDetails(meetingId, password)
    console.log(meetingId, password);

    this.router.navigate(['dashboard/batch/join-meeting'])
  }

}
