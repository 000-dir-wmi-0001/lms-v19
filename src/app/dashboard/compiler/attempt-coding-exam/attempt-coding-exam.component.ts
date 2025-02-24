import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ExamService } from '../../../services/exam.service'; 
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-attempt-coding-exam',
  imports: [CommonModule , ReactiveFormsModule, FormsModule],
  templateUrl: './attempt-coding-exam.component.html',
  styleUrl: './attempt-coding-exam.component.css'
})
export class AttemptCodingExamComponent implements OnInit {

  constructor(private examservice: ExamService, private activatedRoute: ActivatedRoute) { }
  submitted = false
  result: any
  error: any
  str: any;
  language = "java"
  resultArray: number[] = []

  Resultvalue: any

  id: any
  examdetail: any

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id")
    this.examservice.getCODINGquestionbyid(this.id).subscribe(
      {

        next: (data: any) => {
          this.examdetail = data.question
          this.language = this.examdetail['language']
        },
        error: (err) => {
        }
      }
    )
  }


  submit() {
    this.resultArray = []
    this.str = this.examdetail?.['editable'] + this.examdetail?.['nonEditable'];
    this.examservice.addcode(this.str, this.language).subscribe(
      {
        next: (data) => {
          this.result = data
          this.Resultvalue = this.result?.output
          if (this.Resultvalue.length > 17) {
            this.error = true
            this.Resultvalue = this.Resultvalue.slice(19)
            this.Resultvalue = this.Resultvalue.slice(0, -12)
          }
          else
            this.error = false



          for (let i = 0; i < this.Resultvalue.length; i = i + 1) {
            if (this.Resultvalue.charAt(i) == '1') {
              this.resultArray.push(1)
            }
            else if (this.Resultvalue.charAt(i) == '0')
              this.resultArray.push(0)
          }

        },
        error: (err) => {
        }
      }
    )
  }


}
