import { Component, OnInit, HostListener } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { FeeService } from '../../services/fee.service';
import { StudentNotificationService } from '../../services/student-notification.service';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LucideAngularModule, Star, Megaphone, ReceiptIndianRupee, ClipboardMinus, UserRoundPlus, BookOpenCheck, BookUser, Package, DiamondPlus, FileBadge, IndianRupee, UsersRound, Layers2, MessageCircleQuestion, SquareChartGantt, Share2, NotepadText, SquareLibrary, LayoutDashboard, } from 'lucide-angular';
// GraduationCap
@Component({
  imports: [LucideAngularModule, CommonModule, RouterModule, ReactiveFormsModule, FormsModule,],
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {

  //lucid icons
  dashboard_icon = LayoutDashboard;
  //  exam_icon = GraduationCap;
  // exam_icon = NotepadText;
  exam_icon = BookOpenCheck;
  course_icon = SquareLibrary;
  batch_icon = Layers2;
  code_sharing_icon = Share2;
  work_report_icon = ClipboardMinus;
  enquiry_icon = MessageCircleQuestion;
  view_all_users_icon = UsersRound;
  fee_register_icon = IndianRupee;
  fee_receipt_icon = ReceiptIndianRupee;
  moduel_icon = Package;
  request_certification_icon = FileBadge;
  addminsion_icon = DiamondPlus;
  alumini_icon = UserRoundPlus;
  placement_icon = BookUser;
  review_icon = Star;
  daily_notice_icon = Megaphone;


  Messages: any;
  homlink = true;

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
    this.setActiveLink('dashboard');
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
    // console.log("toggleSidebar: ", this.isSidebarExpanded);

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
