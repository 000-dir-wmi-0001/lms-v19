import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../services/review.service';
import { StorageService } from '../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Review {
  Name: string;
  Company: string;
  Package: number;
  Review: string;
  isExpanded: boolean;
}

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {
  contact = 919604430489;
  isLoggedIn = false;
  isNavExpanded: boolean = false;
  allRec: Review[] = [];
  readonly MIN_CHARS = 130; // Minimum character threshold

  constructor(
    private reviewService: ReviewService,
    private storageService: StorageService
  ) { }

  async ngOnInit() {
    this.reviewService.getReview().subscribe({
      next: (res: any) => {
        this.allRec = res.sort((a: Review, b: Review) => b.Package - a.Package);
        this.allRec.forEach(item => {
          item.isExpanded = false;
        });
      },
      error: (err) => {
        console.error('Error fetching reviews:', err);
      }
    });
  }

  toggleReadMore(item: Review): void {
    item.isExpanded = !item.isExpanded;
  }

  shouldShowReadMore(review: string): boolean {
    return review.length > this.MIN_CHARS;
  }

  getTruncatedReview(review: string): string {
    if (!review) return '';


    if (review.length <= this.MIN_CHARS) return review;


    const truncated = review.substr(0, this.MIN_CHARS);
    const lastSpace = truncated.lastIndexOf(' ');
    return truncated.substr(0, lastSpace) + '...';
  }
}
