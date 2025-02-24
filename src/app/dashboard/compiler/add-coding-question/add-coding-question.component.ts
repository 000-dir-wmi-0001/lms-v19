import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { ExamService } from '../../../services/exam.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-coding-question',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-coding-question.component.html',
  styleUrl: './add-coding-question.component.css'
})
export class AddCodingQuestionComponent implements OnInit {

  constructor(
    private examservice: ExamService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) { }

  submitted = true
  isLoading: boolean = false;
  id: any
  type: any
  languageList = ["java", "c", "c++"]
  addquestionform = new UntypedFormGroup({
    language: new UntypedFormControl('', [Validators.required]),
    question: new UntypedFormControl('', [Validators.required]),
    qest_description: new UntypedFormControl('', [Validators.required]),
    editable_ans: new UntypedFormControl('', [Validators.required]),
    non_editable_ans: new UntypedFormControl('', [Validators.required]),
    marks: new UntypedFormControl('', [Validators.required])
  })

  get formControls() {
    return this.addquestionform.controls;
  }

  ngOnInit(): void {
    this.isLoading = false;
    this.type = this.activateRoute.snapshot.paramMap.get("ExamType")
    this.id = this.activateRoute.snapshot.paramMap.get("id")
  }
  onSubmit() {

    if (this.addquestionform.invalid) {
      return;
    }
    const { language, question, qest_description, editable_ans, non_editable_ans, marks } = this.addquestionform.value;
    this.examservice.addcodingquestion(language, question, qest_description, editable_ans, non_editable_ans, parseInt(marks), 1, this.id).subscribe(
      {
        next: (data) => {
          this.isLoading = true;
        },
        error: (err) => {
        }
      }
    )

    this.addquestionform.reset();
  }

  gotobackpage() {
    this.router.navigate([`/dashboard/exam/${this.id}/${this.type}/${'add'}`,]);
  }

  get question() {
    return this.addquestionform.get('question');
  }

  get questiondescription() {
    return this.addquestionform.get('qest_description');
  }

  get answerformat() {
    return this.addquestionform.get('ans_format');
  }

  get marks() {
    return this.addquestionform.get('marks');
  }

  get non_editable_ans() {
    return this.addquestionform.get('non_editable_ans');
  }

  get editable_ans() {
    return this.addquestionform.get('editable_ans');
  }
}
