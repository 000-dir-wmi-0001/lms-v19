import { Component, OnInit, Inject, NgZone, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LiveClassService } from '../../../services/live-class.service';
import ZoomMtgEmbedded from '@zoom/meetingsdk/embedded';

@Component({
  selector: 'app-join-meeting',
  imports: [],
  templateUrl: './join-meeting.component.html',
  styleUrl: './join-meeting.component.css'
})
export class JoinMeetingComponent implements OnInit {

  authEndpoint = 'http://localhost:3000/zoom/signature';
  sdkKey = 'v_ILNsd6RIaXDo60R4yviQ';
  meetingNumber = '';
  passWord = '';
  role = 0;
  userName = 'prasad';
  userEmail = 'harshadabhondave09@gmail.com';
  registrantToken = '';
  zakToken = '';
  leaveUrl = 'http://localhost:4200/dashboard/Live-class';

  @ViewChild('meetingSDKElement', { static: true }) meetingSDKElement!: ElementRef;
  @ViewChild('meetingSDKChatElement', { static: true }) meetingSDKChatElement!: ElementRef;

  client = ZoomMtgEmbedded.createClient();

  constructor(private activatedroute: ActivatedRoute,
    private liveclassservice: LiveClassService,
    public httpClient: HttpClient,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    const meetingDetails = this.liveclassservice.getMeetingDetails();
    this.meetingNumber = meetingDetails.meetingId
    this.passWord = meetingDetails.password
    console.log('Meeting ID:', this.meetingNumber);
    console.log('Password:', this.passWord);
    if (this.meetingNumber !== '' && this.passWord !== '') {
      this.getSignature();
    }

  }


  getSignature() {
    this.httpClient.post(this.authEndpoint, {
      meetingNumber: this.meetingNumber,
      role: this.role
    }).subscribe({
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
        }).catch((error) => {
          console.log(error);
        });
      }).catch((error) => {
        console.log(error);
      });
    });
  }
}

