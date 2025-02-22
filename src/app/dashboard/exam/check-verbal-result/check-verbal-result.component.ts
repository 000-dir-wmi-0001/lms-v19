import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-check-verbal-result',
  imports: [CommonModule],
  templateUrl: './check-verbal-result.component.html',
  styleUrl: './check-verbal-result.component.css'
})

export class CheckVerbalResultComponent implements OnInit {

  constructor(private examservice: ExamService, private activatroute: ActivatedRoute, private router: Router) { }

  eid: any
  studentarray: any
  studentList = [
    { 'name': 'First Name' },
    { 'name': 'Last Name' },
    { 'name': 'Check Recording' }
  ]
  ngOnInit(): void {
    this.eid = this.activatroute.snapshot.paramMap.get("id");
    this.viewattemptedstudent(this.eid)
  }


  viewattemptedstudent(examId: any) {
    this.examservice.ViewStudentAttemptedVerbalExam(examId).subscribe(
      {
        next: (data: any) => {
          this.studentarray = data.students;

        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }

  //verbalResult/:id/:studentid
  goTocheckstudentresult(sid: any) {
    this.router.navigate([`/dashboard/exam/verbalResult/${this.eid}/${sid}`,]);
  }
}
