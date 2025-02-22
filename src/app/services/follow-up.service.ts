import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FollowUp {
  studentName: string;
  date: string; // Store as string for easier comparison
  description: string;
  mobileNo: Number;
}

@Injectable({
  providedIn: 'root'
})
export class FollowUpService {
  private followUps: FollowUp[] = [];
  private notificationSubject = new BehaviorSubject<FollowUp | null>(null);

  constructor(private readonly http: HttpClient) { }

  // Save follow-up
  saveFollowUp(followUp: FollowUp): Observable<any> {
    console.log("followup from service", followUp);

    return this.http.post(`${environment.api}/followup/followups`, followUp);
  }

  // Fetch follow-ups
  getFollowUps(): Observable<FollowUp[]> {
    return this.http.get<FollowUp[]>(`${environment.api}/followup/followups`);
  }

  // Check notifications
  checkNotifications(): void {
    const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
    this.getFollowUps().subscribe((followUps) => {
      this.followUps = followUps;
      followUps.forEach((followUp) => {
        if (followUp.date === today) {
          this.notificationSubject.next(followUp);
        }
      });
    });
  }

  // Get notification observable
  getNotificationObservable(): Observable<FollowUp | null> {
    return this.notificationSubject.asObservable();
  }
}
