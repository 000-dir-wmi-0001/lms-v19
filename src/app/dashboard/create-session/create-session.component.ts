import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-session',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './create-session.component.html',
  styleUrl: './create-session.component.css'
})
export class CreateSessionComponent implements OnInit {
  form: FormGroup;
  qrCode: string = localStorage.getItem('qrCode') || ''; 
  attendanceMessage: string | null = localStorage.getItem('attendanceMessage') || ''; 
  errorMessage: string | null = null;
  sessionId: string = localStorage.getItem('sessionId') || ''; 
  presentStudents: any[] = []; 
  isLive: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.form = this.fb.group({
      topic: ['', Validators.required],
      date: ['', Validators.required],
      batchno: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.autoFillSessionData();
  }

  createSession(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      this.showError('No token found. Please log in again.');
      return;
    }

    if (this.form.invalid) {
      this.showError('Please fill in all required fields.');
      return;
    }

    const formData = this.form.value;
    console.log(formData);
    

    this.http.post<any>(`${environment.api}/user/create-session`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe(
      (response) => {
        if (response.qrCode && response.sessionId) {
          this.qrCode = response.qrCode;
          this.sessionId = response.sessionId;
          this.attendanceMessage = 'Session created successfully. QR Code is ready.';

          localStorage.setItem('qrCode', this.qrCode);
          localStorage.setItem('sessionId', this.sessionId);
          localStorage.setItem('attendanceMessage', this.attendanceMessage);
          this.errorMessage = null;
        } else {
          this.showError('Session creation failed. No QR Code received.');
        }
      },
      (error) => {
        console.error('Error creating session:', error);
        this.showError(error.error?.message || 'Failed to create session.');
      }
    );
  }

  autoFillSessionData(): void {
    const storedDate = localStorage.getItem('sessionDate');
    const storedBatch = localStorage.getItem('sessionBatch');

    if (storedDate && storedBatch) {
      this.form.patchValue({ date: storedDate, batch: storedBatch });
    }
  }

  // getPresentStudents(): void {
  //   if (!this.sessionId) {
  //     this.showError('Session ID is required to fetch attendance.');
  //     return;
  //   }

  //   this.http.get<any>(`${environment.api}/attendance/get-presentStudents`, {
  //     params: { sessionId: this.sessionId }
  //   }).subscribe(
  //     (response) => {
  //       this.presentStudents = response.presentStudents.map((student: any) => ({
  //         rollNumber: student.rollNumber,
  //         name: student.name
  //       }));
        
  //     },
  //     (error) => {
  //       console.error('Error fetching attendance:', error);
  //       this.presentStudents = [];
  //       this.showError(error.error?.message || 'Failed to fetch present students.');
  //     }
  //   );
  // }
  getPresentStudents(): void {
    if (!this.sessionId) {
      this.showError('Session ID is required to fetch attendance.');
      return;
    }
  
    this.http.get<any>(`${environment.api}/attendance/get-presentStudents`, {
      params: { sessionId: this.sessionId }
    }).subscribe(
      (response) => {
        console.log("📌 Received Students:", response.presentStudents);
  
        this.presentStudents = response.presentStudents.map((student: any) => ({
          // rollNumber: student.rollNumber || "N/A",
          name: student.name || "Unknown",
          email: student.email || "Unknown",

        }));
        
      },
      (error) => {
        console.error('Error fetching attendance:', error);
        this.presentStudents = [];
        this.showError(error.error?.message || 'Failed to fetch present students.');
      }
    );
  }
  

  resetSession(): void {
    localStorage.removeItem('qrCode');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('attendanceMessage');
    this.qrCode = '';
    this.sessionId = '';
    this.attendanceMessage = '';
  }

  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = null;
    }, 5000);
  }
}

