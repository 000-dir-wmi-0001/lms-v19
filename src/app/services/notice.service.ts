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
  private token = localStorage.getItem('token');

  constructor(private readonly http: HttpClient) { }

  // Fetch  notices
  getNotices(): Observable<Notice[]> {
    return this.http.get<Notice[]>(`${environment.api}/notice`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }


  // Add  notice
  addNotice(title: string, description: string, userId: string) {
    return this.http.post(`${environment.api}/notice`, { title, description, userId },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  // Update notice
  updateNotice(noticeId: string, userId: string, title: string, description: string): Observable<any> {
    return this.http.put<Notice>(`${environment.api}/notice/${noticeId}`, { title, description },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }


  // Delete notice
  deleteNotice(_id: any): Observable<any> {
    return this.http.delete(`${environment.api}/notice/${_id}`, { observe: 'response', headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
}


