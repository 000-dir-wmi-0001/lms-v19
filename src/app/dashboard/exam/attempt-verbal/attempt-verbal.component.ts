import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { ExamService } from '../../../services/exam.service';
import { StorageService } from '../../../services/storage.service';
import { AudioRecordingService } from './audio-recording.service';

@Component({
  selector: 'app-attempt-verbal',
  imports: [],
  templateUrl: './attempt-verbal.component.html',
  styleUrl: './attempt-verbal.component.css'
})
export class AttemptVerbalComponent implements OnDestroy, OnInit {
  [x: string]: any;

  examId = 0;
  questionId = 0;
  studId = 0;
  token: any;
  questions: any;
  examdetail: any;
  checkrecording: any;
  isRecording = false;
  recordedTime: any;
  blobUrl: any;
  teste: any;
  recquestionid: any;

  constructor(
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private examService: ExamService
  ) {
    this.audioRecordingService
      .recordingFailed()
      .subscribe(() => (this.isRecording = false));
    this.audioRecordingService
      .getRecordedTime()
      .subscribe((time) => (this.recordedTime = time));
    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.teste = data;
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
    });


  }

  ngOnInit(): void {
    this.examId = this.route.snapshot.params['id'];
    this.token = this.storageService.getToken();
    this.studId = JSON.parse(atob(this.token.split('.')[1]))._id;

    this.examService.getVERBALQuestions(this.examId).subscribe({
      next: (data: any) => {
        this.examdetail = data.examQuestions;
        this.questions = data.examQuestions.verbal_questions;
      },
      error: (err) => { },
    });
  }

  updateid(qid: any) {
    this.recquestionid = qid;
  }
  startRecording(qid: any) {
    this.recquestionid = qid;
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording(questionId: any) {
    const form = new FormData();
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }

    const file = new File([this.teste], Date.now() + '.mp3');

    form.append('file', file, file.name);

    form.append('examId', this.examId.toString());
    form.append('questionId', questionId.toString());
    form.append('studId', this.studId.toString());

    this.examService.postVerbalanswer(form).subscribe({
      next: (data) => {
      },
      error: (err) => {
      },
    });
  }

  clearRecordedData() {
    this.blobUrl = null;
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  download(): void {
    const url = window.URL.createObjectURL(this.teste.blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = this.teste.title;
    link.click();
  }
}

