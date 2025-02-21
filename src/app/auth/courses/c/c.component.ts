import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-c',
  imports: [],
  templateUrl: './c.component.html',
  styleUrl: './c.component.css'
})
export class CComponent implements OnInit {
  @ViewChild('overviewScroll') overviewScroll!: ElementRef;
  @ViewChild('curriculumScroll') curriculumScroll!: ElementRef;
  @ViewChild('instructorScroll') instructorScroll!: ElementRef;
  @ViewChild('feedbackScroll') feedbackScroll!: ElementRef;

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Optional: Any initialization logic can go here
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

  onBuy(): void {
    this.router.navigate(['./login']).then(success => {
      if (!success) {
        console.error('Navigation to login failed');
      }
    }).catch(err => {
      console.error('Error during navigation:', err);
    });
  }
}