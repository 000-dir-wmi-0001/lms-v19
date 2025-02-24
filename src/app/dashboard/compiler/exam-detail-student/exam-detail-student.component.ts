import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExamService } from '../../../services/exam.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-detail-student',
  imports: [CommonModule],
  templateUrl: './exam-detail-student.component.html',
  styleUrl: './exam-detail-student.component.css'
})
export class ExamDetailStudentComponent implements OnInit {

  id:any
  examdetail = []
  isLoading:boolean = false;
  constructor(private examservice:ExamService,private activateRoute:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {

    this.isLoading = false;
      this.id=this.activateRoute.snapshot.paramMap.get("id")

     this.examservice.getCODINGQuestions(this.id).subscribe(
      {
         next: (data: any) => {
          this.examdetail = data.codingQuestions.coding_questions
        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }


  gotoattemptexam(id: any) {
    this.isLoading = true;
       this.router.navigate([`/dashboard/compiler/attempt/${id}`,]);
  }
}
