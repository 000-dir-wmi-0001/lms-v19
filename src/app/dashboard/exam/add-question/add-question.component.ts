import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray, UntypedFormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  mark: number;
}
@Component({
  selector: 'app-add-question',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-question.component.html',
  styleUrl: './add-question.component.css'
})

export class AddQuestionComponent implements OnInit {

  array: Array<any> = [];
  id: any;
  type: any;
  items!: UntypedFormArray;
  optionarraytemp: any = [];
  j = 0;
  answers: any = [];
  submitted = false;
  addanswerButtonStatus = true;
  initialOptions = [1, 2, 3, 4]; // For the four blank options
  addBy: string = "Manual"

  topic: string = '';            // User input for topic
  difficulty!: null;

  constructor(private fb: UntypedFormBuilder, private examservice: ExamService, private activatedroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.id = this.activatedroute.snapshot.paramMap.get("id");
    this.type = this.activatedroute.snapshot.paramMap.get("Examtype");

    console.log(this.addBy);

    this.initializeForm();
  }

  question: any;
  reactform!: UntypedFormGroup;
  initializeForm() {
    this.reactform = this.fb.group({
      question: new UntypedFormControl('', Validators.required),
      options: this.fb.array([]), // To store options dynamically
      Marks: new UntypedFormControl('', [Validators.required, Validators.min(2)]),
      // Initial options
      initialOption0: ['', Validators.required],
      initialOption1: ['', Validators.required],
      initialOption2: ['', Validators.required],
      initialOption3: ['', Validators.required],
    });
  }


  saveFormDataToBackend() {

    const question = this.reactform.get('question')?.value;
    const marks = this.reactform.get('Marks')?.value;


    let optionsArray: any[] = [];

    // Push initial options to the optionsArray
    optionsArray.push(this.reactform.get('initialOption0')?.value);
    optionsArray.push(this.reactform.get('initialOption1')?.value);
    optionsArray.push(this.reactform.get('initialOption2')?.value);
    optionsArray.push(this.reactform.get('initialOption3')?.value);



    // Validate if at least 2 options are provided and 1 correct answer exists
    if (optionsArray.length < 2) {
      alert("At least 2 options are required.");
      return; // Stop the submission if validation fails
    }

    // Get the correct answer using the updated getCorrectAnswer method
    const correctAnswer = this.getCorrectAnswer(optionsArray);

    // Create MCQ data structure to send to the backend
    const mcqData: MCQ[] = [{
      question: question,
      options: optionsArray,
      correctAnswer: correctAnswer,
      mark: marks
    }];

    // Structure data to send to the backend
    const dataToSend = {
      topic: this.topic,
      difficulty: this.difficulty,
      questions: mcqData,
      addBy: this.addBy
    };

    // Save the data to the backend
    this.examservice.saveMcqToLLM(dataToSend, this.id).subscribe({
      next: (res) => {
        console.log('MCQs saved successfully', res);
        alert('MCQs saved successfully!');
      },
      error: (err) => {
        console.error('Error saving MCQs', err);
        alert('Error saving MCQs');
      }
    });
  }

  // Function to get the correct answer from options
  getCorrectAnswer(optionsArray: string[]): string {
    // You may already have logic to determine the correct answer
    // Here, we're assuming the correct answer is the first one that is marked 'true' in `this.answers`
    for (let i = 0; i < this.answers.length; i++) {
      if (this.answers[i]['status'] === true) {
        // Find the answer in optionsArray and return it
        return this.answers[i]['answer'];
      }
    }

    // If no correct answer found, handle accordingly
    alert("No correct answer selected.");
    return ''; // Return empty or default value if no correct answer found
  }



  get formControls() {
    return this.reactform.controls;
  }

  get addOptionRow() {
    return this.reactform.get("options") as UntypedFormArray;
  }

  generaterow() {
    return new UntypedFormGroup({
      optionvalue: new UntypedFormControl('', Validators.required)
    });
  }

  addnewrow(event: any) {
    event.preventDefault();
    this.items = this.reactform.get("options") as UntypedFormArray;
    this.items.push(this.generaterow());
  }

  addanswer() {
    const formValue = this.reactform.value;
    // Combine initial options with added options for correct answer selection
    this.optionarraytemp = [
      { optionvalue: formValue.initialOption0 },
      { optionvalue: formValue.initialOption1 },
      { optionvalue: formValue.initialOption2 },
      { optionvalue: formValue.initialOption3 },
      ...this.addOptionRow.controls.map(option => ({ optionvalue: option.value.optionvalue }))
    ];

    this.answers = [];
    for (let i = 0; i < this.optionarraytemp.length; i++) {
      this.answers.push({ "answer": this.optionarraytemp[i]['optionvalue'], "status": false });
    }
  }

  onChange(option: string, isSelected: any) {
    // Set status to true for the selected correct answer and reset others to false
    if (isSelected) {
      for (let i = 0; i < this.answers.length; i++) {
        this.answers[i].status = this.answers[i].answer === option;
      }
    }
  }

  Removeitem(i: any) {
    (this.reactform.get('options') as UntypedFormArray).removeAt(i);
  }
  addVerbalquestion() {
    this.examservice.addverbalquestion(this.reactform.get("question")?.value, this.reactform.get("Marks")?.value, this.id).subscribe({
      next: (data) => {
        alert("question succesfully added")
      },
      error: (err) => {
      }
    })
  }
  //   procedsave() {
  //     let optionarray: any[] = [];
  //     let answerlist: any[] = [];

  //     this.submitted = true;

  //     if (this.reactform.invalid) {
  //         alert("Please fill in all required fields correctly.");
  //         return;
  //     }

  //     // Collect the selected answers and ensure correct selection
  //     for (let i = 0; i < this.answers.length; i++) {
  //         if (this.answers[i]['status'] === true) {
  //             optionarray.push(this.answers[i]['answer']);
  //         }
  //         answerlist.push(this.answers[i]['answer']);
  //     }

  //     if (optionarray.length < 1 || answerlist.length < 2) {
  //         alert("At least 2 options are required and 1 correct answer is required.");
  //         return;
  //     } else {
  //         (<HTMLInputElement>document.getElementById("submit")).disabled = false;
  //     }

  //     const { question, Marks } = this.reactform.value;
  //     this.examservice.addquestion(question, answerlist, optionarray, parseInt(Marks), this.id).subscribe(
  //         {
  //             next: (data) => {
  //                 alert("Question added successfully!");
  //                 this.gotoexamdetail();
  //             },
  //             error: (err) => {
  //                 alert("Error adding the question. Please try again.");
  //             }
  //         }
  //     );
  // }


  gotoexamdetail() {
    this.router.navigate([`/dashboard/exam/${this.id}/${this.type}/add`]);
  }
}

