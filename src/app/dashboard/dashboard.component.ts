import { Component, ElementRef, HostListener, OnInit, ViewChild , TemplateRef, ChangeDetectorRef} from '@angular/core';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import jsQR from 'jsqr';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
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


  attendanceMessage: string | null = null;
  errorMessage: string | null = null;

  devices: MediaDeviceInfo[] = [];
  selectedDevice: MediaDeviceInfo | null = null;
  isCameraActive: boolean = false;


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
  showPopup: boolean = false;
  modalRef?: BsModalRef;


  @ViewChild('template', { static: true }) template!: TemplateRef<any>;
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;

  videoStream: MediaStream | null = null;


  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef;
  @ViewChild('userIcon') userIcon!: ElementRef;

  constructor(
    private onlineStatusService: OnlineStatusService,
    private storageService: StorageService,
    private router: Router,
    private feeService: FeeService,
    private notification: StudentNotificationService,
    private sidebarService: SidebarService,
    private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private http: HttpClient

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

  // openModal(template: TemplateRef<void>) {
  //   console.log("working");
  //   this.modalRef = this.modalService.show(template);
  // }

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


  togglePopup() {
    this.showPopup = !this.showPopup;
  }

  closePopup() {
    this.showPopup = false;
  }

  async loadDevices(): Promise<void> {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      this.devices = devices.filter(device => device.kind === 'videoinput');
      if (this.devices.length > 0) {
        this.selectedDevice = this.devices[0];
      }
    } catch (err: unknown) {
      this.setErrorMessage(err instanceof Error ? `Error getting devices: ${err.message}` : 'Unknown error occurred while getting devices.');
    }
  }

 
  openModal(template: TemplateRef<any>): void {
    this.modalRef = this.modalService.show(template);
    setTimeout(() => {
      this.loadDevices();
      this.startVideoStream();
    }, 500); // Delay to allow modal to render
  }
  closeModal() {
    this.stopVideoStream();
    this.modalRef?.hide();
  }

  startVideoStream(): void {
    if (this.isCameraActive) {
      console.warn('Camera is already active.');
      return;
    }
  
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoStream = stream;
        this.isCameraActive = true;
  
        if (this.videoElement?.nativeElement) {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();
        }
  
        console.log('Camera started');
        
        // Start scanning after camera starts
        setTimeout(() => this.scanQRCode(), 1000);
      })
      .catch(err => {
        this.setErrorMessage(`Camera access error: ${err.message}`);
      });
  }


  stopVideoStream(): void {
    if (!this.isCameraActive || !this.videoStream) {
      console.warn('No active video stream to stop.');
      return;
    }

    this.videoStream.getTracks().forEach(track => track.stop());
    this.videoStream = null;
    this.isCameraActive = false;

    if (this.videoElement?.nativeElement) {
      this.videoElement.nativeElement.srcObject = null;
    }

    console.log('Camera turned off');
  }

  onDeviceSelectChange(event: Event): void {
    const selectedDeviceId = (event.target as HTMLSelectElement).value;
    this.selectedDevice = this.devices.find(device => device.deviceId === selectedDeviceId) || null;
  }

  // setErrorMessage(message: string): void {
  //   this.errorMessage = message;
  //   this.attendanceMessage = null;
  //   setTimeout(() => {
  //     this.errorMessage = null;
  //   }, 10000);
  // }

  // processScannedData(scannedData: string): void {
  //   const token = localStorage.getItem('token');
  
  //   if (!token) {
  //     this.setErrorMessage('No token found. Please log in again.');
  //     return;
  //   }
  
  //   try {
  //     const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
  //     console.log('Decoded Token:', decodedToken);
      
  //     // Log all parameters present in the token
  //     Object.keys(decodedToken).forEach(key => {
  //       console.log(`${key}:`, decodedToken[key]);
  //     });
  
  //   } catch (error) {
  //     this.setErrorMessage('Failed to decode token.');
  //     console.error('Token Decoding Error:', error);
  //   }
  // }


  
  processScannedData(scannedData: string): void {
    if (!scannedData) {
      this.setErrorMessage('Invalid QR Code!');
      return;
    }

    console.log('Scanned Data:', scannedData);

    const urlParams = new URLSearchParams(scannedData.split('?')[1]);
    const sessionId = urlParams.get('sessionId');
    const teacherId = urlParams.get('teacherId');

    if (!sessionId || !teacherId) {
      this.setErrorMessage('Invalid QR Code data!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.setErrorMessage('No token found. Please log in again.');
      return;
    }

    const decodedToken: any = JSON.parse(atob(token.split('.')[1]));
    console.log('Decoded Token:', decodedToken);

    let studentRollNo = decodedToken._id;
    let batch = decodedToken.batchno;

    console.log('Extracted Student Roll Number:', studentRollNo);
    console.log('Extracted Batch:', batch);

    if (!studentRollNo || studentRollNo === 'null') {
      this.setErrorMessage('Failed to fetch student roll number. Please log in again.');
      return;
    }

    if (!batch || batch === 'null') {
      this.setErrorMessage('Failed to fetch batch number. Please log in again.');
      return;
    }

    this.http
      .post<any>(
        `${environment.api}/attendance/mark?sessionId=${sessionId}&teacherId=${teacherId}&studentRollNo=${studentRollNo}&batch=${batch}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .subscribe(
        response => {
          this.setSuccessMessage(response.message || 'Attendance marked successfully!');
        },
        error => {
          this.setErrorMessage(error.error?.message || 'Failed to mark attendance');
        }
      );
  }

  scanQRCode(): void {
    if (!this.videoElement || !this.canvasElement) return;
  
    const video = this.videoElement.nativeElement as HTMLVideoElement;
    const canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
    const context = canvas.getContext('2d');
  
    const scan = () => {
      if (!this.isCameraActive) return; // Stop if camera is off
  
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
      if (!imageData) {
        requestAnimationFrame(scan);
        return;
      }
  
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
      
      if (qrCode) {
        console.log('QR Code Detected:', qrCode.data);
        this.processScannedData(qrCode.data);
      } else {
        requestAnimationFrame(scan);
      }
    };
  
    requestAnimationFrame(scan);
  }

    // ✅ Function to show success message & auto-hide after 10 sec
    setSuccessMessage(message: string): void {
      this.attendanceMessage = message;
      this.errorMessage = null;
      setTimeout(() => {
        this.attendanceMessage = null;
      }, 10000);
    }
  
    // ❌ Function to show error message & auto-hide after 10 sec
    setErrorMessage(message: string): void {
      this.errorMessage = message;
      this.attendanceMessage = null;
      setTimeout(() => {
        this.errorMessage = null;
      }, 10000);
    }
  
// captureQR(): void {
//   console.log("Capture button clicked");

//   if (!this.videoElement?.nativeElement || !this.canvasElement?.nativeElement) {
//     console.error("Video or canvas element not found");
//     this.setErrorMessage("Error: Video or canvas element not found. Please try again.");
//     return;
//   }

//   const video = this.videoElement.nativeElement as HTMLVideoElement;
//   const canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
//   const context = canvas.getContext('2d');

//   if (!context) {
//     console.error("Canvas context not found");
//     return;
//   }

//   canvas.width = video.videoWidth;
//   canvas.height = video.videoHeight;
//   context.drawImage(video, 0, 0, canvas.width, canvas.height);

//   const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//   console.log('Captured image data:', imageData);

//   const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

//   if (qrCode) {
//     console.log('QR Code Detected:', qrCode.data);
//     this.processScannedData(qrCode.data);
//   } else {
//     console.log('No QR Code found.');
//     this.setErrorMessage('No QR code detected. Try again.');
//   }
// }

}
