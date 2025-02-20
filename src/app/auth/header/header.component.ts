import { Component, HostListener, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  imports: [RouterLink, CommonModule],
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  token: any;
  userId: any;
  isLoggedIn = false;
  role: any;
  isNavExpanded = false;
  isCoursesDropdownOpen = false;

  constructor(private storageService: StorageService) { }

  ngOnInit(): void {
    this.token = this.storageService.getToken();
    if (this.token) {
      this.userId = JSON.parse(atob(this.token.split('.')[1]))?._id;
    }
    this.isLoggedIn = !!this.storageService.isLoggedIn();
    if (!this.isLoggedIn) {
      localStorage.clear();
    }
    this.role = this.storageService.getRole();
  }

  // Toggle navigation for mobile view
  toggleNavigation() {
    this.isNavExpanded = !this.isNavExpanded;
  }

  // Toggle the Courses dropdown
  toggleCoursesDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isCoursesDropdownOpen = !this.isCoursesDropdownOpen;
  }

  // Close the dropdown when clicked outside
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const clickedInside = (event.target as HTMLElement).closest('.dropdown-menu');
    const clickedOnToggle = (event.target as HTMLElement).closest('.dropdown-toggle');
    if (!clickedInside && !clickedOnToggle) {
      this.isCoursesDropdownOpen = false;
    }
  }

  public getRole() {
    return this.storageService.getRole();
  }
}
