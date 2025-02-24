import { Component, OnInit, Inject, NgZone, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LiveClassService } from '../../../services/live-class.service';
import { UserService } from '../../../services/user.service';
import { StorageService } from '../../../services/storage.service';
import { Router } from '@angular/router';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

@Component({
  selector: 'app-join-meet',
  imports: [],
  templateUrl: './join-meet.component.html',
  styleUrl: './join-meet.component.css'
})
export class JoinMeetComponent implements OnInit {

  sdkKey = 'v_ILNsd6RIaXDo60R4yviQ';
  meetingNumber = '';
  passWord = '';
  role = 0;
  userName: any | null;
  userEmail = 'harshadabhondave09@gmail.com';
  registrantToken = '';
  zakToken = '';


  @ViewChild('meetingSDKElement', { static: true }) meetingSDKElement!: ElementRef;
  @ViewChild('meetingSDKChatElement', { static: true }) meetingSDKChatElement!: ElementRef;

  token: any;
  userId: any;

  client = ZoomMtgEmbedded.createClient();

  constructor(private activatedroute: ActivatedRoute,
    private router: Router,
    private liveclassservice: LiveClassService,
    public httpClient: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private userService: UserService,
    private storageService: StorageService,
    private ngZone: NgZone
  ) { }


  async ngOnInit(): Promise<void> {
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;

    if (this.userId) {
      try {
        // Await the completion of the getUserName method
        await this.getUserName(this.userId);

        // Once username is fetched, proceed with meeting logic
        const meetingDetails = this.liveclassservice.getMeetingDetails();
        this.meetingNumber = meetingDetails.meetingId
        this.passWord = meetingDetails.password
        console.log('Meeting ID:', this.meetingNumber);
        console.log('Password:', this.passWord);

        if (this.meetingNumber !== '' && this.passWord !== '') {
          this.getSignature(); // Now you can safely call getSignature
        }

      } catch (err) {
        console.error('Error fetching username:', err);
      }
    }
  }

  getUserName(userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.userService.getUserName(userId).subscribe({
        next: (response: any) => {
          if (response) {
            const firstName = response.user.firstName;
            const lastName = response.user.lastName;
            // Concatenate first name and last name to form the username
            this.userName = `${firstName} ${lastName}`
            resolve(); // Resolve when the username is fetched
          } else {
            reject('Failed to fetch username');
          }
        },
        error: (err: any) => {
          reject(err);
        }
      });
    });
  }


  getSignature() {
    this.liveclassservice.getMeetingSignature(this.meetingNumber, this.role).subscribe({
      next: (data: any) => {
        console.log("signature", data.signature);

        if (data.signature) {
          console.log(data.signature);
          this.startMeeting(data.signature);
        } else {
          console.log(data);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }




  startMeeting(signature: any) {
    this.ngZone.runOutsideAngular(() => {
      this.client.init({
        zoomAppRoot: this.meetingSDKElement.nativeElement,
        language: 'en-US',
        patchJsMedia: true,
        leaveOnPageUnload: true,
        customize: {
          video: {
            popper: {
              disableDraggable: true
            },
            isResizable: true,
            viewSizes: {
              default: {
                width: 800,
                height: 550
              },
              ribbon: {
                width: 200,
                height: 400
              }
            }
          },
          chat: {
            popper: {
              disableDraggable: true,
              anchorElement: this.meetingSDKChatElement.nativeElement,
              placement: 'right'
            }
          }
        }
      }).then(() => {
        console.log("zoom initialized");

        this.client.join({
          signature: signature,
          sdkKey: this.sdkKey,
          meetingNumber: this.meetingNumber,
          password: this.passWord,
          userName: this.userName,
          userEmail: this.userEmail,
          tk: this.registrantToken,
          zak: this.role === 1 ? this.zakToken : undefined,
        }).then(() => {
          console.log('joined successfully');

          this.client.on('connection-change', () => {
            this.onMeetingLeave();
          });
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }

  onMeetingLeave() {
    this.client.leaveMeeting().then(() => {
      console.log("Meeting ended successfully.");
      this.ngZone.run(() => {
        this.router.navigate(['/dashboard/batch/userbatches']).then(() => {
          window.location.reload(); // Refresh the window after navigation
        });
      });
    }).catch(error => console.error("Error ending meeting:", error));
  }

}
