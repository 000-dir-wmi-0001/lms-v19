import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { OnlineStatusService, OnlineStatusType } from 'ngx-online-status';
import { StorageService } from '../services/storage.service';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { FeeService } from '../services/fee.service';
import { StudentNotificationService } from '../services/student-notification.service';
import { SidebarService } from '../services/sidebar.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { LucideAngularModule, Bell, UserRound, ShoppingCart, CircleUserRound, LogOut } from 'lucide-angular';

@Component({
  imports: [LucideAngularModule, RouterOutlet, RouterModule, ReactiveFormsModule, FormsModule, CommonModule, LeftNavComponent],
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'], // Changed to .scss
  providers: [OnlineStatusService],
})
export class DashboardComponent implements OnInit {
  //lucide icons
  account_circle = CircleUserRound;
  logout_ic = LogOut;
  user_ic = UserRound;
  cart_ic = ShoppingCart;
  bell_ic = Bell;






  status!: OnlineStatusType;
  onlineStatusCheck: any = OnlineStatusType;
  token!: string;
  userId!: string;
  pendingFee: boolean = true;
  Messages: any[] = [];
  userName: string = '';
  userProfileImage?: string;
  activeLink: string = '';
  isSidebarExpanded: boolean = true;
  isNavbarCollapsed = false;
  isMobile: boolean = false;
  isDropdownOpen: boolean = false;

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('userIcon') userIcon!: ElementRef;

  constructor(
    private onlineStatusService: OnlineStatusService,
    private storageService: StorageService,
    private router: Router,
    private feeService: FeeService,
    private notification: StudentNotificationService,
    private sidebarService: SidebarService
  ) {
    this.checkIfMobile();
  }

  ngOnInit() {
    this.initializeUser();
    this.setupSidebarSubscription();
    this.setupMobileDetection();
    if (this.userId) {
      this.getAllNotifications();
      this.checkFees();
    }
  }

  private initializeUser() {
    this.token = this.storageService.getToken() || '';
    if (this.token) {
      const tokenData = JSON.parse(atob(this.token.split('.')[1]));
      this.userId = tokenData._id;
      this.userName = tokenData.name || 'User';
      this.userProfileImage = tokenData.profileImage;
    }
  }

  private setupSidebarSubscription() {
    this.sidebarService.isSidebarExpanded$.subscribe(expanded => {
      this.isSidebarExpanded = expanded;
    });
  }

  private setupMobileDetection() {
    this.checkIfMobile();
    window.addEventListener('resize', () => this.checkIfMobile());
  }

  private checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  @HostListener('document:click', ['$event'])
  closeDropdownOnOutsideClick(event: Event) {
    if (!this.userIcon?.nativeElement.contains(event.target) &&
      !this.dropdownMenu?.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeNavbar() {
    this.isNavbarCollapsed = false;
    this.isDropdownOpen = false;
  }

  getRole(): string {
    return this.storageService.getRole() ?? '';
  }

  isLoggedIn(): boolean {
    return this.storageService.isLoggedIn() === 'true';
  }

  async logout() {
    this.storageService.clear();
    await this.router.navigate(['/auth/login']);
  }

  private checkFees() {
    if (!this.userId) return;

    this.feeService.getFeesStud(this.userId).subscribe({
      next: (result: any) => {
        this.pendingFee = result[0]?.pendingFee !== 0;
      },
      error: (error: any) => {
        console.error('Error checking fees:', error);
      }
    });
  }

  private getAllNotifications() {
    if (!this.userId) return;

    this.notification.getAllNotifications(this.userId).subscribe({
      next: (response: any) => {
        this.Messages = response.Notifications;
      },
      error: (error: any) => {
        console.error('Error fetching notifications:', error);
      }
    });
  }

  ngOnDestroy() {
    // Cleanup resize listener
    window.removeEventListener('resize', () => this.checkIfMobile());
  }
}
