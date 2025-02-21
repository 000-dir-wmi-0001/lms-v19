import { Component, OnInit, Pipe, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-python',
  imports: [],
  templateUrl: './python.component.html',
  styleUrl: './python.component.css'
})
export class PythonComponent implements OnInit {
  @ViewChild('overviewScroll') overviewScroll!: ElementRef;
  @ViewChild('curriculumScroll') curriculumScroll!: ElementRef;
  @ViewChild('instructorScroll') instructorScroll!: ElementRef;
  @ViewChild('feedbackScroll') feedbackScroll!: ElementRef;


  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  scrollTo(section: string): void {
    let element: ElementRef | undefined;

    switch (section) {
      case 'overview':
        element = this.overviewScroll;
        break;
      case 'curriculum':
        element = this.curriculumScroll;
        break;
      case 'instructor':
        element = this.instructorScroll;
        break;
      case 'feedback':
        element = this.feedbackScroll;
        break;
      default:
        console.warn('Section not found:', section);
    }

    if (element) {
      element.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  onBuy(){
    this.router.navigate(['./login']);
  }
}
