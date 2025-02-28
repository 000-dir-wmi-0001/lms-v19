import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class PosService {
  private token = localStorage.getItem('token');
  constructor(private readonly http: HttpClient) { }

  gotPos() {
    return this.http.get(`${environment.api}/pos`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
}
