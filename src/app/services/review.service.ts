import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
export interface Review {
  _id?: string;
  Name: string;
  Company: string;
  Package: number;
  Review: string;
}
@Injectable({
  providedIn: 'root'
})

export class ReviewService {

  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  public addReview(body: any) {
    return this.http.post(`${environment.api}/addReview`, body,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  public getReview() {
    return this.http.get(`${environment.api}/addReview`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  public updateReview(uri: string, review: Review): Observable<void> {
    return this.http.put<void>(`${environment.api}/${uri}`, review,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  public deleteReview(id: any) {
    return this.http.delete(`${environment.api}/addReview/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
}
