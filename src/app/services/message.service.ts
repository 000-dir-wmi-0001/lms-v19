import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private token = localStorage.getItem('token');

  constructor(private readonly http: HttpClient) { }


  createMsg(data: any) {
    return this.http.post(`${environment.api}/message/createMsg`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
}
