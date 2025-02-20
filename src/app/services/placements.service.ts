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

  constructor(private http:HttpClient) { }

  public getUploadURL(body:any){
    return this.http.post(environment.api + '/addPlacement/', body);
  }

  public postPlace(body: any){
    return this.http.post(`${environment.api}/addPlacement`,body);
  }
  public getPlace(){
    return this.http.get(`${environment.api}/addPlacement`);
  }
  public deletePlace(id:any){
    return this.http.delete(`${environment.api}/addPlacement/${id}`)
  }
  public updatePlace(uri: string, place: Place): Observable<void> {
    return this.http.put<void>(`${environment.api}/${uri}`, place);
  }
}
