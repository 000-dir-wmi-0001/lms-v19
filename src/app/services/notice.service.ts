import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


interface Notice {
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  constructor(private readonly http: HttpClient) { }

  // Fetch  notices
  getNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(`${environment.api}/notice`);
  }


  // Add  notice
  addNotice(title: string, description: string, userId: string) {
    return this.http.post(`${environment.api}/notice`, { title, description, userId });
  }
  // Update notice
  updateNotice(noticeId: string, userId: string, title: string, description: string): Observable<any> {
    return this.http.put<Notice>(`${environment.api}/notice/${noticeId}`, { title, description });
  }


  // Delete notice
  deleteNotice(_id: any): Observable<any> {
    return this.http.delete(`${environment.api}/notice/${_id}`, { observe: 'response' });
  }
}


