import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
}

@Component({
  selector: 'app-add-llm-question',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-llm-question.component.html',
  styleUrl: './add-llm-question.component.css'
})
export class AddLlmQuestionComponent implements OnInit {



  constructor(private examservice: ExamService, private activatedroute: ActivatedRoute, private router: Router) { }

  topic: string = '';            // User input for topic
  difficulty: string = '';
  type: any;
  model: string = "llama3-8b-8192"; // Initialize with default value
  temperature: number = 1;
  max_tokens: number = 1024;
  top_p: number = 1;
  stream: boolean = true;
  stop: string[] | null = null;
  // User input for difficulty
  questions: any[] = [];          // Store MCQ response
  currentQuestionIndex: number = 0; // Track current question

  showQuiz: boolean = false;    // Default value
  mcqResult: MCQ[] = [];
  selectedAnswers: { [key: string]: string } = {};
  correctedAns: { [key: string]: string } = {}
  score: Number = 0;
  loading: boolean = false;
  exam_id!: string;
  addBy: string = "LLM";


  formattedMcqs: { question: string, options: string[], userAnswer: string, correctAnswer: string }[] = [];



  ngOnInit(): void {
    const examId = this.activatedroute.snapshot.paramMap.get('examId') as string;
    this.exam_id = examId;
    this.type = this.activatedroute.snapshot.paramMap.get("Examtype");



    if (this.topic === '') {
      const examTopic = this.examservice.getExamTopic();
      this.topic = examTopic.topicName

    }


  }

  generateQuestions() {
    this.loading = true;

    this.examservice.generateMcqByLLM(this.topic, this.difficulty).subscribe({
      next: (response: any) => {



        if (response && response.mcqResult) {
          this.mcqResult = response.mcqResult; // Store the MCQs in the variable
          this.mcqResult.forEach((mcq: any) => {
            this.correctedAns[mcq.question] = mcq.correctAnswer;
          });
          console.log('Generated MCQs:', this.mcqResult);
          console.log("selected ans ", this.selectedAnswers);
          console.log("Corrected Ans", this.correctedAns);
          // this.saveMcqsToBackend();
          this.loading = false;



        } else {
          console.error('mcqResult not found in response');
        }
      },
      error: (error: any) => {
        console.error('Error generating MCQs:', error);
      },
    });
  }


  saveMcqsToBackend() {
    const mcqData = {
      topic: this.topic,
      difficulty: this.difficulty,
      questions: this.mcqResult,
      addBy: this.addBy
    };

    this.examservice.saveMcqToLLM(mcqData, this.exam_id).subscribe({
      next: (res) => {
        console.log('MCQs saved successfully', res);
        alert('MCQs saved successfully!');


        // Your logic to save MCQs to the backend
        console.log('MCQs saved in backend and flag set to true');
      },

      error: (err) => console.error('Error saving MCQs', err)

    });
    // this.router.navigate(['/student'])
  }








  submitAnswers() {
    console.log('submitAnswers called');

    const selectedAnswers = this.formattedMcqs.map(mcq => mcq.userAnswer);
    console.log('User answers:', selectedAnswers);

    this.score = this.calculateScore(this.selectedAnswers, this.correctedAns);
    console.log(`Your score is ${this.score}`);

    // Ensure selected and corrected answers are populated
    console.log("Selected Answers: ", this.selectedAnswers);
    console.log("Corrected Answers: ", this.correctedAns);


  }

  isAllQuestionsAnswered(): boolean {
    return this.mcqResult.every(mcq => this.selectedAnswers[mcq.question]);
  }
  onAnswerSelect(mcqIndex: number, option: string) {
    this.formattedMcqs[mcqIndex].userAnswer = option;
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
