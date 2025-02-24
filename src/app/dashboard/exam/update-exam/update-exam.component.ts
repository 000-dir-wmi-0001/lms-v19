import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkWithHref } from '@angular/router';
import { ExamService } from '../exam.service';
import { ExamService as examservice } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-exam',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './update-exam.component.html',
  styleUrl: './update-exam.component.css'
})
export class UpdateExamComponent implements OnInit {
  questionId: any;
  questionArray: any;
  examId: any;
  examType: any;
  question: any = {
    name: '',
    options: [],
    answers: [],
    mark: null
  };

  constructor(
    private examservice: ExamService,
    private examService: examservice,
    private activatedroute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.examId = this.activatedroute.snapshot.paramMap.get('eid');
    this.questionId = this.activatedroute.snapshot.paramMap.get('qid');
    this.examType = this.activatedroute.snapshot.paramMap.get('type');
    console.log(this.examType);


    /* this.fetchQuestions(); */
    this.fetchLlmQuestions();
  }

  fetchQuestions(): void {
    this.examservice.getQuestions(this.examId).subscribe({
      next: (data: any) => {
        this.questionArray = data.examQuestions.questions;
        this.question = this.questionArray.find((element: any) => element._id === this.questionId) || this.question;
      },
      error: (err: any) => {
        console.error('Error fetching questions:', err);
      }
    });
  }

  /*   updateQuestion(): void {
      this.examservice.updateQuestion(
        this.questionId,
        this.question.name,
        this.question.options,
        this.question.answers,
        this.question.mark,

      ).subscribe({
        next: (data: any) => {
          this.router.navigate([`/dashboard/exam/${this.examId}/${this.examType}/add`]);
        },
        error: (err: any) => {
          console.error('Error updating question:', err);
        }
      });
    } */

  fetchLlmQuestions() {
    this.examService.fetchMcqs(this.examId).subscribe({
      next: (response: any) => {
        this.questionArray = response.formattedMcqs
        this.question = this.questionArray.find((element: any) => element._id === this.questionId) || this.question;
        console.log("fetchbyllm", this.question);
      },
      error: (error: any) => {
        console.error("error fetching LLMquestions", error);

      }

    })
  }
  updatellmQuestion(): void {
    this.examService
      .updatellmQuestion(
        this.questionId,       // Pass question ID
        this.question.name,    // Updated name
        this.question.options, // Updated options
        this.question.answers, // Updated answers
        this.question.mark,    // Updated mark
        this.examId
      )
      .subscribe({
        next: (response: any) => {
          console.log("Question updated successfully:", response);
          this.router.navigate([`/dashboard/exam/${this.examId}/${this.examType}/add`]);
          this.fetchLlmQuestions();
        },
        error: (err: any) => {
          console.error("Error updating question:", err);
        },
      });
  }

  gotoAddQuestion() {
    this.router.navigate([`/dashboard/exam/${this.examId}/${this.examType}/add`])
  }


}
