import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { StorageService } from '../services/storage.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { FeeService } from '../services/fee.service';
import { StudentNotificationService } from '../services/student-notification.service';
import { SidebarService } from '../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { LeftNavComponent } from "./left-nav/left-nav.component";

@Component({
  imports: [CommonModule, RouterLink, LeftNavComponent, RouterOutlet],
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  status: OnlineStatusType = 0;
  onlineStatusCheck: any = OnlineStatusType;

  token!: any;
  userId!: any;
  pendingFee: boolean = true;
  Messages: any;
  activeLink: string = '';
  isSidebarExpanded: boolean = true;
  isNavbarCollapsed = false;
  isMobile: boolean = false;
  isDropdownOpen: boolean = false;  // Track dropdown state
  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('userIcon') userIcon!: ElementRef;
  constructor(
    private onlineStatusService: OnlineStatusService,
    private storageService: StorageService,
    private router: Router,
    private feeService: FeeService,
    private notification: StudentNotificationService,
    private sidebarService: SidebarService
  ) { }

  ngOnInit() {
    this.token = this.storageService.getToken();
    if (this.token) {
      this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    }

    this.sidebarService.isSidebarExpanded$.subscribe(expanded => {
      this.isSidebarExpanded = expanded;
    });

    if (this.userId) {
      this.getAllNotifications();
    }

    this.isMobile = window.innerWidth <= 768;

    window.onresize = () => {
      this.isMobile = window.innerWidth <= 768;
    };
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event) {
    if (!this.userIcon.nativeElement.contains(event.target) &&
      !this.dropdownMenu?.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  closeNavbar() {
    this.isNavbarCollapsed = false;
  }

  getRole() {
    return this.storageService.getRole();
  }

  isLoggedIn() {
    return this.storageService.isLoggedIn();
  }

  logout() {
    this.storageService.clear();
    this.router.navigate(['../login']);
  }

  checkFees() {
    this.token = this.storageService.getToken();
    if (this.token) {
      this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
      this.feeService.getFeesStud(this.userId).subscribe(
        (result: any) => {
          if (result[0]?.pendingFee == 0) {
            this.pendingFee = false;
          }
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }

  getAllNotifications() {
    if (this.userId) {
      this.notification.getAllNotifications(this.userId).subscribe({
        next: (response: any) => {
          this.Messages = response.Notifications;
        },
        error: (err: any) => {
          console.log(err);
        }
      });
    }
  }
}
