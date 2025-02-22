import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExamService } from '../../../services/exam.service';


@Component({
  selector: 'app-check-student-verbal-result',
  imports: [],
  templateUrl: './check-student-verbal-result.component.html',
  styleUrl: './check-student-verbal-result.component.css'
})
export class CheckStudentVerbalResultComponent implements OnInit {

  constructor(private examservice: ExamService, private activatroute: ActivatedRoute) { }
  eid: any
  sid: any
  recordarray: any
  ngOnInit(): void {
    this.eid = this.activatroute.snapshot.paramMap.get("id");
    this.sid = this.activatroute.snapshot.paramMap.get("studentid");
    this.viewattemptedstudent(this.eid)
  }

  viewattemptedstudent(examId: any) {
    this.examservice.getVerbalResultForStudent(this.eid, this.sid).subscribe(
      {
        next: (data: any) => {
          this.recordarray = data.response
        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }

}
