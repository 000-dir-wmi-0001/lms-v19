import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';
import { ExamService } from '../../../services/exam.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-attempt',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './exam-attempt.component.html',
  styleUrl: './exam-attempt.component.css'
})
export class ExamAttemptComponent implements OnInit, OnDestroy {

  examId: any;
  type: any;
  questions: any;
  token: any;
  userId: any;
  array: any = [];
  questionarray: any;
  newoptionarray: any = [];
  postoption: any = [];
  length: any;
  getMarks = false;
  check: boolean = false;
  startTime!: string;
  endTime!: string;
  timerInterval: any;
  difference: any;
  timer!: number;
  interval: any;
  isExamSubmitted: boolean = false;
  examDeatails: any = { courseName: "", topic: "", examType: "", startDate: "" }
  formattedMcqs: { question: string, options: string[], userAnswer: string, correctAnswer: string }[] = [];

  selectedAnswers: { [key: string]: string } = {};
  correctedAns: { [question: string]: { answer: string; marks: number } } = {};
  obtainedMarks: any = 0;
  mcqs: any[] = [];

  // Track screen change attempts
  screenChangeAttempts: number = 0;
  maxScreenChangeAttempts: number = 3;

  originalFavicon!: string;
  alertDisplayed: boolean = false;

  constructor(
    private examservice: ExamService,
    private activatroute: ActivatedRoute,
    private storageService: StorageService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.examId = this.activatroute.snapshot.paramMap.get("id");
    this.examDeatails.examType = this.activatroute.snapshot.paramMap.get("type");

    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;

    this.enterFullScreen();
    this.examDetails()
    this.fetchMcqsForStudents()

    // Capture original favicon
    // this.originalFavicon = (document as any).querySelector("link[rel*='icon']")?.getAttribute('href') || '';

    // Add event listeners for screen change detection
    //window.onblur = () => this.handleScreenChange();
    //window.onfocus = () => this.restoreFavicon();

    // Disable keyboard shortcuts
    // this.disableKeyboardShortcuts();
  };

  examDetails() {
    this.examservice.getExamDetails(this.examId).subscribe({
      next: (res: any) => {
        console.log("examdetails", res.exam);
        this.startTime = res.exam.startTime
        this.endTime = res.exam.endTime
        console.log("startTime", this.startTime, " endTime", this.endTime);

        this.examDeatails.courseName = res.exam.course.name
        this.examDeatails.topic = res.exam.name
        this.examDeatails.startDate = res.exam.startDate

        this.startExamTimer(this.startTime, this.endTime);
      }
    })
  };


  fetchMcqsForStudents() {

    this.examservice.fetchMcqs(this.examId).subscribe({
      next: (data: any) => {
        this.questions = data.formattedMcqs
        console.log('Fetched MCQs:', this.questions);
        if (data && data.formattedMcqs) {

          data.formattedMcqs.forEach((question: any) => {
            if (question.name && question.answers?.length > 0) {
              this.correctedAns[question.name] = {
                answer: question.answers[0], // First correct answer
                marks: question.mark, // Marks for the question
              };

            }
            else {
              console.warn(`Missing data for question: ${question}`);
            }
          });
          console.log("corrected answers", this.correctedAns);
        }
        else {
          console.error('mcqs not found in response');
        }

        const llmQuestions = Array.isArray(data.formattedMcqs) ? data.formattedMcqs : [];
        this.questionarray = [...llmQuestions]
        const allQuestions = Array.isArray(data.formattedMcqs) ? data.formattedMcqs : [];
        this.questions = allQuestions;
        console.log('All questions:', this.questions);
        const randomQuestions = this.getRandomQuestions(allQuestions, 15);
        this.questionarray = [...randomQuestions];
        console.log('Random questions:', this.questionarray);

        /*  const difference = this.timeDifference(this.startTime, this.endTime);
         this.startTimer(difference); */

        // // Automatically enter full-screen mode
        // this.enterFullScreen();
        /*     const currentTime = new Date();

           const examStartTime = this.parseTime(this.startTime);
           const examEndTime = this.parseTime(this.endTime);

            // Check if current time is after the start time
            if (currentTime > examStartTime) {
              const remainingTime = Math.floor((examEndTime.getTime() - currentTime.getTime()) / 1000);
              this.startTimer(remainingTime);
            } else {
              const totalDuration = Math.floor((examEndTime.getTime() - examStartTime.getTime()) / 1000);
              this.startTimer(totalDuration);
            }  */
        // Automatically enter full-screen mode
        this.enterFullScreen();
      }
    });
  }

  getRandomQuestions(questions: any[], count: number): any[] {
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }
    return questions.slice(0, count);
  }

  onAnswerSelect(mcqIndex: number, option: string) {
    if (this.questionarray[mcqIndex]) {
      const question = this.questionarray[mcqIndex].name;
      this.selectedAnswers[question] = option;
      this.questionarray[mcqIndex].userAnswer = option;
      console.log('Selected Answers:', this.selectedAnswers);
    } else {
      console.error(`Invalid mcqIndex: ${mcqIndex}`);
    }
  }

  calculateScore(): number {


    for (let question in this.selectedAnswers) {
      // Check if the question exists in correctedAns
      if (
        this.correctedAns[question] &&
        this.selectedAnswers[question] === this.correctedAns[question].answer
      ) {
        this.obtainedMarks += this.correctedAns[question].marks; // Use marks from correctedAns
      }
      console.log("obtain marks");

    }

    return this.obtainedMarks;


  }



  // Calculate the time difference between two times and return remaining seconds
  calculateRemainingTime(startTime: string, endTime: string): number {
    const now = new Date();

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0, 0);
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0, 0);

    // If end time is earlier than start time, assume it is on the next day
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1); // Move endDate to the next day
    }
    // If the current time is before the start time
    if (now < startDate) {
      return Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
    }
    // If the current time is between start time and end time
    if (now >= startDate && now <= endDate) {
      return Math.floor((endDate.getTime() - now.getTime()) / 1000);
    }
    // If the current time is after the end time, the exam is over
    return 0;
  };

  // Start the countdown timer and update it every second
  startExamTimer(startTime: string, endTime: string): void {
    const remainingTime = this.calculateRemainingTime(startTime, endTime);

    /*   if (remainingTime <= 0) {
        alert('The exam time has already ended.');
        this.clearTimer();
        return;
      } */

    this.timer = remainingTime; // Set the initial remaining time

    this.interval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--; // Decrease timer by 1 second
      } else {
        clearInterval(this.interval); // Stop the timer when it reaches 0
        alert('The exam has ended.');
        this.submitExam(this.examId); // Call the function to submit the exam
      }
    }, 1000);
  }
  // Stop the timer when it's no longer needed
  ngOnDestroy(): void {
    window.onblur = null;
    window.onfocus = null;
    this.clearTimer();
  };

  disableKeyboardShortcuts(): void {
    window.addEventListener('keydown', (event) => {
      // Prevent default action for the Escape key
      console.log(event.key)
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        alert('You cannot exit full screen until the exam is over.'); // Alert when trying to exit full screen
      }

      // Prevent other keyboard shortcuts for screen changes
      if (event.altKey || event.ctrlKey || event.metaKey) {
        event.preventDefault();
      }
    });
  }

  /*
    parseTime(timeStr: string): Date {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const time = new Date();
      time.setHours(hours, minutes, 0, 0);
      return time;
    }
    timeDifference(startTime: string, endTime: string): number {
      const startParts = startTime.split(':').map(Number);
      const endParts = endTime.split(':').map(Number);
      const startDate = new Date();
      startDate.setHours(startParts[0], startParts[1], 0, 0);
      const endDate = new Date();
      endDate.setHours(endParts[0], endParts[1], 0, 0);
      const differenceInMilliseconds = endDate.getTime() - startDate.getTime();
      const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
      return differenceInSeconds;
    }
    startTimer(duration: number): void {
      this.timer = duration;

      this.interval = setInterval(() => {
        if (this.timer > 0) {
          this.timer--;
        } else {
          clearInterval(this.interval);
          this.submitExam(this.questions?._id);
        }
      }, 1000);
    } */
  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
  }
  pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }

  onChange(examid: any, questionid: any, option: any, isselecetd: any, buttontype: any) {
    this.check = false;
    this.newoptionarray = [];
    if (buttontype === 'radio') {
      for (let i = 0; i < this.array.length; i++) {
        if (this.array[i]['questionid'] === questionid) {
          this.array[i]['option'] = option;
          this.check = true;
          break;
        }
      }

    } else if (buttontype === 'checkbox') {
      for (let i = 0; i < this.array.length; i++) {
        if (this.array[i]['questionid'] === questionid) {
          for (let j = 0; j < this.array[i]['option']?.length; j++) {
            this.newoptionarray.push(this.array[i]['option'][j]);
          }

          if (isselecetd === true) {
            this.newoptionarray.push(option);
            this.array[i]['option'] = this.newoptionarray;
          } else {
            this.newoptionarray.splice(this.newoptionarray.indexOf(option), 1);
            this.array[i]['option'] = this.newoptionarray;
          }
          this.check = true;
          break;
        }
      }
    };

    if (this.check === false) {
      this.array.push({
        "examid": examid,
        "questionid": questionid,
        "option": option,
        "isselecetd": isselecetd,
        "buttontype": buttontype
      });
    }

    for (let i = 0; i < this.array.length; i++) {
      if (this.array[i]['questionid'] === questionid) {
        this.postoption = this.array[i]['option'];
        break;
      }
    }

    this.examservice.postanswer(examid, questionid, this.userId, this.postoption).subscribe({
      next: (data) => { },
      error: (err) => { }
    });
  }

  submitExam(id: any) {
    let resultId: string;
    this.isExamSubmitted = true;
    this.clearTimer();
    this.getMarks = true;
    this.obtainedMarks = this.calculateScore();
    console.log(`Your obtained marks is ${this.obtainedMarks}`);

    console.log("Selected Answers: ", this.selectedAnswers);
    console.log("Corrected Answers: ", this.correctedAns);

    this.examservice.recordResult(this.examId, this.userId, this.obtainedMarks).subscribe({
      next: (res: any) => {
        resultId = res._id;
        console.log("result stored succesfully");
        this.router.navigate([`/dashboard/exam/display-marks/${this.userId}/${this.examId}/${resultId}`]);

      }, error: (err: any) => {
        console.log(err);

        console.error("something is wrong");

      }
    })



    this.exitFullScreen();
  }

  enterFullScreen(): void {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if ((elem as any).mozRequestFullScreen) {
      // For Firefox
      (elem as any).mozRequestFullScreen();
    } else if ((elem as any).webkitRequestFullscreen) {
      // For Chrome, Safari, and Opera
      (elem as any).webkitRequestFullscreen();
    } else if ((elem as any).msRequestFullscreen) {
      // For IE/Edge
      (elem as any).msRequestFullscreen();
    }

    console.log('Entered full-screen mode');
  }

  exitFullScreen(): void {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).mozCancelFullScreen) {

      // For Firefox
      (document as any).mozCancelFullScreen();
    } else if ((document as any).webkitExitFullscreen) {
      // For Chrome, Safari, and Opera
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      // For IE/Edge
      (document as any).msExitFullscreen();
    }

    console.log('Exited full-screen mode');
  }

  isFullScreenActive(): boolean {
    return !!(
      document.fullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
    );
  };

  clearTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  };

  handleScreenChange(): void {
    this.screenChangeAttempts++;
    this.changeFaviconToError();
    if (!this.alertDisplayed) {
      alert('You have attempted to leave the screen. After 3 attempts, the exam will be automatically submitted.');
      this.alertDisplayed = true;
    }
    if (this.screenChangeAttempts >= this.maxScreenChangeAttempts) {
      this.submitExam(this.questions._id);
    }
  };

  changeFaviconToError(): void {
    const link = (document as any).querySelector("link[rel*='icon']");
    if (link) {
      link.href = 'path_to_error_icon'; // Replace with your error icon path
    }
  };

  restoreFavicon(): void {
    const link = (document as any).querySelector("link[rel*='icon']");
    if (link && this.originalFavicon) {
      link.href = this.originalFavicon;
    }
  }
}

