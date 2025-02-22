import { Component, OnInit } from '@angular/core';

import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  code: string;
}

@Component({
  selector: 'app-add-exam',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-exam.component.html',
  styleUrl: './add-exam.component.css'
})

export class AddExamComponent implements OnInit {

  examForm!: UntypedFormGroup;
  llmForm!: UntypedFormGroup;
  submitted = false;
  today: any;
  showInitialButtons = true;
  showManualForm = false;
  showAIForm = false;

  temperature: number = 1;
  max_tokens: number = 1024;
  top_p: number = 1;
  stream: boolean = true;
  stop: string[] | null = null;
  topic: string = '';            // User input for topic
  difficulty: string = '';        // User input for difficulty
  questions: any[] = [];          // Store MCQ response
  currentQuestionIndex: number = 0; // Track current question
  exam_id!: string;

  showQuiz: boolean = false;    // Default value
  mcqResult: MCQ[] = [];
  selectedAnswers: { [key: string]: string } = {};
  correctedAns: { [key: string]: string } = {}
  score: Number = 0;
  loading: boolean = false;
  formattedMcqs: { question: string, options: string[], userAnswer: string, correctAnswer: string }[] = [];



  constructor(private examService: ExamService, private formBuilder: UntypedFormBuilder, private router: Router, private storageService: StorageService, private activatedroute: ActivatedRoute) { }

  listcourse = [];
  token: any;
  userId: any;
  examtype = ["MCQ", "CODING", "VERBAL"];

  ngOnInit(): void {
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0];

    this.examForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      startDate: ['', [Validators.required]],
      courseName: ['', [Validators.required]],
      courseId: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]]
    }, { validators: this.timeRangeValidator });

    this.dropdownvalue();


    this.llmForm = this.formBuilder.group({
      topic: ['', [Validators.required]],
      difficulty: ['', [Validators.required]]
    });
    const examId = this.activatedroute.snapshot.paramMap.get('examId') as string;
    this.exam_id = examId;
    console.log("Examid from llm-question component", examId);

  }

  processSelectedItem(item: any) {
    this.examForm.controls['courseId'].setValue(item._id);
  }

  dropdownvalue() {
    this.examService.getcourseDropDownValue().subscribe({
      next: (data: any) => {
        this.listcourse = data.courses;
      }
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.examForm.controls;
  }


  toggleAddMethod(method: string) {
    this.showInitialButtons = false;
    this.showAIForm = method === 'llm';
    this.showManualForm = method === 'manual';

  }



  addExam() {
    this.submitted = true;

    // Validate form before proceeding
    if (this.examForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Please fill in all required fields correctly.',
      });
      return;


    }
    const { name, type, startDate, courseId, startTime, endTime } = this.examForm.value;

    const formattedStartDate = startDate.split('-').reverse().join('-');

    // Use SweetAlert if the time range is invalid
    if (this.examForm.errors && this.examForm.errors['invalidTimeRange']) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Time Range',
        text: 'The start time must be earlier than the end time!',
      });
      return;
    }

    this.examService.addExam(name, type, formattedStartDate, courseId, this.userId, startTime, endTime).subscribe(
      {
        next: (data) => {
          this.showToast('success', 'Exam added successfully');
          this.router.navigate(['dashboard/exam']);
        },
        error: (err) => {
          this.showToast('error', 'Failed to add exam');
        }
      }
    );
  }


  timeRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const startDate = control.get('startDate')?.value;
    const startTime = control.get('startTime')?.value;
    const endTime = control.get('endTime')?.value;

    if (startDate && startTime && endTime) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${startDate}T${endTime}`);

      const now = new Date();

      if (startDateTime < now) {
        return { invalidTimeRange: true };
      }

      if (startDateTime >= endDateTime) {
        return { invalidTimeRange: true };
      }
    }
    return null;
  }

  private showToast(icon: 'success' | 'error', title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      customClass: { popup: 'swal-wide' },
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({ icon, title });
  }



  /*llm starts here */
  generateQuestions() {
    this.loading = true;

    this.examService.generateMcqByLLM(this.topic, this.difficulty).subscribe({
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
      topic: this.llmForm.get('topic')?.value,
      difficulty: this.llmForm.get('difficulty')?.value,
      questions: this.mcqResult

    };

    this.examService.saveMcqToLLM(mcqData, this.exam_id).subscribe({
      next: (res: any) => {
        console.log('MCQs saved successfully', res);
        // this.sharedService.updateMcqData(mcqData);
        // this.router.navigate(['/student']);
        // this.sharedService.setFlag(true);
        this.router.navigate(['/student']);

        // Your logic to save MCQs to the backend
        console.log('MCQs saved in backend and flag set to true');
      },
      error: (err: any) => console.error('Error saving MCQs', err)

    });
  }
}
