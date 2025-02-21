import { Router } from '@angular/router';
import { Component, OnInit, Pipe, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-cpp',
  imports: [],
  templateUrl: './cpp.component.html',
  styleUrl: './cpp.component.css'
})
export class CppComponent implements OnInit {
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
