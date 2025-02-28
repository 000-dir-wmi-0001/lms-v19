import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { shareReplay, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Alumni {
  _id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: string;
  skills: string;
  passoutYear: number | null;
  company: string;
  jobTitle: string;
  experience: string;
  currentCTC?: string;
  expectedCTC?: string;
  createdAt: Date;
}
@Injectable({
  providedIn: 'root'
})
export class AlumniService {
  private token = localStorage.getItem('token');

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) { }

  // Get all alumni
  getAlumni(uri: string, token: string): Observable<Alumni[]> {
    return this.http.get<Alumni[]>(`${environment.api}/${uri}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  // Get a specific alumnus by ID
  getOneAlumnus(uri: string, token: string, alumnusId: string): Observable<Alumni> {
    return this.http.post<Alumni>(`${environment.api}/${uri}`, { token: token, alumnusId: alumnusId });
  }

  // Add a new alumnus
  addAlumnus(uri: string, alumniData: Alumni): Observable<Alumni> {
    return this.http.post<Alumni>(`${environment.api}/${uri}`, { ...alumniData },

      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  // Token and User ID management
  getAccessToken() {
    return localStorage.getItem('token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('token', accessToken);
  }

  private setSession(userId: string, accessToken: string) {
    localStorage.setItem('user-id', userId);
    if (accessToken !== null) {
      localStorage.setItem('token', accessToken);
    }
  }

  // update alumni details
  updateAlumnus(uri: string, alumnus: Alumni): Observable<void> {
    const updateData = {
      ...alumnus,
      currentCTC: alumnus.currentCTC || '',
      expectedCTC: alumnus.expectedCTC || ''
    };
    return this.http.put<void>(`${environment.api}/${uri}`, updateData,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  deleteAlumnus(uri: string): Observable<void> {
    return this.http.delete<void>(`${environment.api}/${uri}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

}
