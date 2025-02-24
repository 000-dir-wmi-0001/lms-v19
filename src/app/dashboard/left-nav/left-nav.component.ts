import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FeeService } from '../../services/fee.service';
import { StudentNotificationService } from '../../services/student-notification.service';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule,],
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {



  Messages: any;

  activeLink: string = ''; // Property to track the active link

  constructor(private storageService: StorageService,
    private router: Router,
    private feeService: FeeService,
    private notification: StudentNotificationService,
    private sidebarService: SidebarService
  ) { }
  token!: any;
  userId!: any;
  pendingFee: boolean = true;
  isSidebarExpanded: boolean = true; // Initially expanded
  isMobile: boolean = false; // Flag to detect mobile screen

  ngOnInit(): void {
    this.checkScreenWidth();
  }

  isDropdownOpen = false;
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobile = window.innerWidth <= 767;
    if (this.isMobile) {
      this.isSidebarExpanded = false;
    } else {
      this.isSidebarExpanded = true;
    }
  }

  toggleSidebar() {
    console.log("toggleSidebar: ", this.isSidebarExpanded);

    this.sidebarService.toggleSidebar();
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  public getRole() {
    return this.storageService.getRole();
  }

  setActiveLink(link: string) {
    this.activeLink = link;
  }
}
