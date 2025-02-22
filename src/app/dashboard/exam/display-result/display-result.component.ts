import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-display-result',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './display-result.component.html',
  styleUrl: './display-result.component.css'
})
export class DisplayResultComponent implements OnInit {

  constructor(private examService: ExamService, private activatroute: ActivatedRoute, private router: Router) { }

  sid: any
  eid: any
  result: any
  obtainedMarks: any
  totalMarks: any
  finalresult: any
  name: any;
  examName: any
  resultAnalysis: any
  resultId: any
  ngOnInit(): void {
    this.sid = this.activatroute.snapshot.paramMap.get("studId");
    this.eid = this.activatroute.snapshot.paramMap.get("examId");
    this.resultId = this.activatroute.snapshot.paramMap.get("resultId")   //document (db document) id of obtainmarks
    this.examService.getResult(this.sid, this.eid).subscribe(
      {
        next: (data: any) => {
          //   this.result=data
          //   this.obtainedMarks=data.obtainedMarks
          //   this.totalMarks=data.totalMarks
          //   this.examName=data.examName.name
          //   if(this.totalMarks===null)
          //   this.totalMarks=1
          //  this.resultAnalysis=data.resultanalysis

          //   this.finalresult=(this.obtainedMarks/this.totalMarks)*10

        },

        error: (err) => {
        }
      }
    )
    this.getMarks()
  }

  getMarks() {
    this.examService.getMcqMarks(this.resultId).subscribe({
      next: (res: any) => {
        console.log("result info", res);

      },
      error: (err: any) => {
        console.log("error", err);

      }
    })
  }

  getFinalMarks() {
    const finalmarks = (this.obtainedMarks / this.totalMarks) * 100;
    return finalmarks;
    console.log(finalmarks);

  }

  gotolistpage() {
    this.router.navigate([`/dashboard/exam`,]);
  }
}
