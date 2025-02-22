import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentNotificationService {

  constructor(private http: HttpClient) { }

  saveNotification(user: any, message: any) {
    return this.http.post(`${environment.api}/studentNotification/saveNotification/`, { user, message });
  }

  getAllNotifications(id: any) {
    return this.http.get(`${environment.api}/studentNotification/getAllNotifications/${id}`);
  }

}
