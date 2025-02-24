import { Component, OnInit, Inject, NgZone, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { LiveClassService } from '../../../services/live-class.service';
import { StorageService } from '../../../services/storage.service';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

@Component({
  selector: 'app-start-meet',
  imports: [CommonModule],
  templateUrl: './start-meet.component.html',
  styleUrl: './start-meet.component.css'
})
export class StartMeetComponent implements OnInit {
  //authEndpoint = 'http://localhost:3000/zoom/signature';

  sdkKey = 'v_ILNsd6RIaXDo60R4yviQ';
  meetingNumber = '';
  passWord = '';
  role = 1;
  userName = 'Harshada Bhondave';
  userEmail = 'harshadabhondave09@gmail.com';
  registrantToken = '';
  zakToken = '';


  @ViewChild('meetingSDKElement', { static: true }) meetingSDKElement!: ElementRef;
  @ViewChild('meetingSDKChatElement', { static: true }) meetingSDKChatElement!: ElementRef;

  token: any;
  userId: any;

  client = ZoomMtgEmbedded.createClient();

  constructor(private activatedroute: ActivatedRoute, private router: Router,
    public httpClient: HttpClient, private liveclassService: LiveClassService, private userService: UserService, private storageService: StorageService,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone) { }

  async ngOnInit(): Promise<void> {
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;

    if (this.userId) {
      try {
        // Await the completion of the getUserName method
        await this.getUserName(this.userId);
        this.meetingNumber = this.activatedroute.snapshot.paramMap.get('meetId') as string;
        this.passWord = this.activatedroute.snapshot.paramMap.get('pwd') as string;
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
    this.liveclassService.getMeetingSignature(this.meetingNumber, this.role).subscribe({
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
                width: 700,
                height: 500
              }
            }
          },
          chat: {
            popper: {
              disableDraggable: false,
              anchorElement: this.meetingSDKChatElement.nativeElement,
              placement: 'right-start',

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
          zak: this.zakToken,

        }).then(() => {
          console.log('joined successfully');

          // Listen for the meeting end event and redirect to leaveUrl
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
        this.router.navigate(['/dashboard/batch']).then(() => {
          window.location.reload(); // Refresh the window after navigation
        });
      });
    }).catch(error => console.error("Error ending meeting:", error));
  }

}

