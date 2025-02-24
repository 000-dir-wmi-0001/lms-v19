import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExamService } from '../../../services/exam.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-detail',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './exam-detail.component.html',
  styleUrl: './exam-detail.component.css'
})
export class ExamDetailComponent implements OnInit {
  score: Number = 0;
  id: any;
  data: any
  course: any
  examtype: any
  buttonType: any
  questionarray: any
  examquestions = []
  questions = []//verbal
  codingquestionarray = [];
  showAddButtons = false;
  topic: string = ''
  isAddbyLLM: boolean = false;
  questionId: any;
  addBy: any
  startDate: any;
  selectedAnswers: { [question: string]: string } = {};  // Object to store selected answers
  correctedAns: { [question: string]: string } = {};
  formattedMcqs: { question: string, options: string[], userAnswer: string, correctAnswer: string }[] = [];
  mcqs: any[] = [];



  constructor(private activatedRoute: ActivatedRoute,
    private examservice: ExamService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get("id")
    this.examtype = this.activatedRoute.snapshot.paramMap.get("ExamType")
    this.buttonType = this.activatedRoute.snapshot.paramMap.get("str")
    this.isAddbyLLM = this.examservice.getAddByLLMFlag();
    this.questionId = this.activatedRoute.snapshot.paramMap.get('qid');

    if (this.examtype == 'MCQ') {
      this.getMcqs()
    }
    else if (this.examtype == 'CODING') {
      this.getCODINGquestions()
    }
    else (this.examtype == 'VERBAL'); {
      this.getVERBALquestions()
    }

    this.getVERBALquestions()
  }


  showAddQuestionButtons() {
    this.showAddButtons = true;
  }
  addManually() {
    this.addBy = "addManually"
    this.router.navigate([`/dashboard/exam/add-question/${this.id}/${this.examtype}/${this.addBy}`]);
  }

  // Handle action for "Add by LLM" (Placeholder)
  addByLLM() {
    this.addBy = "addByLLM"
    this.examservice.setExamTopic(this.topic)
    this.examservice.setAddByLLMFlag(true);
    this.router.navigate([`/dashboard/exam/addllm-question/${this.id}`])


  }

  // gotoMCQquestion() {
  //   this.router.navigate([`/dashboard/exam/add-question/${this.id}/${this.examtype}`,]);
  // }

  gotoCODINGquestion() {
    this.router.navigate([`/dashboard/compiler/add-question/${this.id}/${this.examtype}`,]);
  }
  gotoVERBALquestion() {
    this.router.navigate([`/dashboard/exam/add-question/${this.id}/${this.examtype}`,]);
  }


  getExamType() {
    return this.examtype;
  }

  gotoUpdateQuestion(qid: any, type: any) {
    this.router.navigate([`/dashboard/exam/update-question/${qid}/${this.id}/${this.examtype}`,]);
  }




  getMCQquestions() {
    this.examservice.getMCQQuestions(this.id).subscribe(
      {
        next: (data: any) => {
          console.log("GETMCQ");
          this.course = data.examQuestions
          console.log(this.course)
          this.data = data.examQuestions
          console.log(this.data);

          this.questionarray = this.data.questions;
          console.log("QuestionArray", this.questionarray);
          this.getMcqs()

        },
        error: (err: { error: { message: any; }; }) => {
          console.log("GETMCQ Error");
        }
      }

    )

  }

  getMcqs(): void {

    this.examservice.getExamDetails(this.id).subscribe({
      next: (res: any) => {
        console.log("examdetails", res.exam);
        this.course = res.exam.course.name;
        this.topic = res.exam.name;
        this.startDate = res.exam.startDate;

      }
    })
    this.examservice.fetchMcqs(this.id).subscribe({
      next: (data: any) => {

        console.log("GETMCQBYLLM", data.formattedMcqs);

        const llmQuestions = Array.isArray(data.formattedMcqs) ? data.formattedMcqs : [];
        this.questionarray = [...llmQuestions];

        console.log("Combined QuestionArray (after LLM questions):", this.questionarray);

        if (data) {

          this.mcqs.forEach((mcq: any) => {

            mcq.questions.forEach((question: any) => {
              this.correctedAns[question.question] = question.correctAnswer;

              this.formattedMcqs.push({
                question: question.question,
                options: question.options,
                userAnswer: '',
                correctAnswer: question.correctAnswer
              });
            });
          });


          console.log(this.formattedMcqs, "response in formatted mcqs ");

        }




      },
      error: (err: { error: { message: any } }) => {
        console.error("Error fetching MCQs:", err.error.message);
      }
    });
  }


  submitAnswers() {
    console.log('submitAnswers called');
    const selectedAnswers = this.formattedMcqs.map(mcq => mcq.userAnswer);
    console.log('User answers:', selectedAnswers);
    this.score = this.calculateScore(this.selectedAnswers, this.correctedAns);
    console.log(`Your score is ${this.score}`);

    console.log("Selected Answers: ", this.selectedAnswers);
    console.log("Corrected Answers: ", this.correctedAns);

    this.router.navigate(['/score'], {
      state: {
        score: this.score,
        selectedAnswers: this.selectedAnswers,
        correctedAns: this.correctedAns
      }
    });
  }

  isAllQuestionsAnswered(): boolean {
    return this.mcqs.every(mcq => this.selectedAnswers[mcq.question]);
  }

  onAnswerSelect(mcqIndex: number, option: string) {
    if (this.formattedMcqs[mcqIndex]) {  // Ensure the index is valid
      const question = this.formattedMcqs[mcqIndex].question; // Get the question text
      this.selectedAnswers[question] = option; // Store selected answer
      this.formattedMcqs[mcqIndex].userAnswer = option; // Store in formattedMcqs as well
      console.log('Selected Answers:', this.selectedAnswers);
    } else {
      console.error(`Invalid mcqIndex: ${mcqIndex}`);
    }
  }


  calculateScore(selectedAnswers: { [key: string]: string }, correctedAns: { [key: string]: string }): number {
    let score = 0;
    for (let question in selectedAnswers) {
      if (selectedAnswers[question] === correctedAns[question]) {
        score += 2; // Increment score by 2 for each correct answer
      }
    }
    return score;
  }

  getCODINGquestions() {
    this.examservice.getCODINGQuestions(this.id).subscribe(
      {
        next: (data: any) => {
          this.course = data.codingQuestions
          this.codingquestionarray = data.codingQuestions.coding_questions
        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }

  getVERBALquestions() {
    this.examservice.getVERBALQuestions(this.id).subscribe(
      {
        next: (data: any) => {
          this.course = data.examQuestions
          this.data = data.examQuestions
          this.questions = this.data.verbal_questions;
        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }


  deleteQuestion(questionId: any) {

    this.examservice.deleteQuestion(this.id, questionId).subscribe(
      {
        next: (data: any) => {
          this.getMCQquestions()

        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }


  deletecodingQuestion(questionId: any) {
    this.examservice.deletecodingQuestion(this.id, questionId).subscribe(
      {
        next: (data: any) => {
          this.getCODINGquestions()

        },
        error: (err: { error: { message: any; }; }) => {
        }
      }
    )
  }


  deleteLLMQuestion(questionId: any): void {
    this.examservice.deletellmQuestion(questionId).subscribe({
      next: (res: any) => {
        console.log("question deleted successfully");

      },
      error: (err: any) => {
        console.error("Error deleting question:", err);
      },
    })
  }
}
