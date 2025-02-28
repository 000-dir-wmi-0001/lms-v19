import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface StudentAttendance {
  name: string;
  email: string;
  attendancePercentage: string;
}

@Component({
  selector: 'app-attendance-report',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './attendance-report.component.html',
  styleUrl: './attendance-report.component.css'
})
export class AttendanceReportComponent implements OnInit {
  students: StudentAttendance[] = [];
  startDate: string = '';
  endDate: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {}

  fetchReport(): void {
    if (!this.startDate || !this.endDate) {
      this.errorMessage = "Please select both start and end dates.";
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    this.http.get<any>(`${environment.api}/attendance/getattendanceReport`, {
      params: { startDate: this.startDate, endDate: this.endDate }
    }).subscribe(
      (response) => {
        if (response.students && Array.isArray(response.students)) {
          this.students = response.students.map((student:any) => ({
            name: `${student.firstName} ${student.lastName}`, // Combine first and last name
            email: student.email,
            attendancePercentage: student.attendancePercentage || "0.00"
          }));
        } else {
          this.students = [];
        }
        this.isLoading = false;
      },
      (error) => {
        console.error("Error fetching attendance report:", error);
        this.errorMessage = error.error?.message || "Failed to fetch attendance report.";
        this.isLoading = false;
      }
    );
  }
}
