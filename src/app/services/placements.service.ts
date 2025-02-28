import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Place {
  _id?: string;
  Name: string;
  Company: string;
  Package: number;
  File: File;
}
@Injectable({
  providedIn: 'root'
})
export class PlacementsService  {
  private token = localStorage.getItem('token');

  constructor(private http:HttpClient) { }

  public getUploadURL(body:any){
    return this.http.post(environment.api + '/addPlacement/', body,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public postPlace(body: any){
    return this.http.post(`${environment.api}/addPlacement`,body,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  public getPlace(){
    return this.http.get(`${environment.api}/addPlacement`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  public deletePlace(id:any){
    return this.http.delete(`${environment.api}/addPlacement/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
  public updatePlace(uri: string, place: Place): Observable<void> {
    return this.http.put<void>(`${environment.api}/${uri}`, place,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
}
