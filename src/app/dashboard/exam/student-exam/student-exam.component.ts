import { Component, OnInit } from '@angular/core';
import { ExamService } from '../../../services/exam.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-exam',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './student-exam.component.html',
  styleUrl: './student-exam.component.css'
})
export class StudentExamComponent implements OnInit {

  score: Number = 0;
  showQuiz: boolean = false;
  quizStarted: boolean = false;
  questions: any[] = [];    // Array of questions fetched from the database
  selectedAnswers: { [question: string]: string } = {};  // Object to store selected answers
  correctedAns: { [question: string]: string } = {};
  formattedMcqs: { question: string, options: string[], userAnswer: string, correctAnswer: string }[] = [];

  mcqs: any[] = [];  // Array to store fetched MCQs
  topic: string = '';
  mcqData: any;

  constructor(private examservice: ExamService, private router: Router) { }

  ngOnInit(): void {
  }

  fetchDataFromBackend() {
    // Your logic to fetch data from the backend
    console.log('Data fetched from backend');
  }

  getMcqs(): void {
    this.examservice.fetchMcqs(this.topic).subscribe({
      next: (data: any) => {
        this.mcqs = data;
        console.log('Fetched MCQs:', this.mcqs);
        this.quizStarted = true;
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


          console.log(this.formattedMcqs);

        } else {
          console.error('mcqs not found in response');
        }
      },
      error: (err) => {
        console.error('Error fetching MCQs:', err);
      }
    });
  }

  displayMcqs(): void {
    this.mcqs.forEach((mcq) => {
      console.log('Question:', mcq.questions);
      console.log('Options:', mcq.questions.options);
      console.log('Correct Answer:', mcq.questions.correctAnswer);
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

}

