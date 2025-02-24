import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LiveClassService {
  private apiUrl = 'http://localhost:3000' ;
  private meetingId: string = ''
  private password: string = ''

  constructor(private http:HttpClient) { }


  getMeetingSignature(meetingNumber: string, role: number): Observable<any> {
    return this.http.post(`${environment.api}/zoom/signature`, { meetingNumber, role });
  }

  createMeeting(meetingData:any): Observable<any>{
    return this.http.post<any>(`${environment.api}/zoom/createMeeting`,meetingData)
  }

  getAllMeetings(batchId?: string) {
    console.log("batchid from services  ",batchId);
    
    const url = batchId 
      ? `${environment.api}/zoom/getMeetings?batchId=${batchId}`
      : `${environment.api}/zoom/getMeetings`;
    return this.http.get(url);
  }
 
  deleteMeeting(meetingId:Number){
    return this.http.delete(`${environment.api}/zoom/deleteMeeting/${meetingId}`)
  }

  // Inside liveclassservice (Angular Service)
updateMeeting(editingMeetingId: number, meetingData: any) {
  const url = `${environment.api}/zoom/updateMeeting/${editingMeetingId}`;  // Make sure this matches your backend route
  return this.http.put(url, meetingData);  // PUT request to update meeting
}


  setMeetingDetails(meetingId:string, password:string){
    this.meetingId = meetingId,
    this.password = password
  }


  getMeetingDetails(){   /* For getting id and password to start/join the meeting */
    return {
     meetingId: this.meetingId,
     password :this.password
    }
  }

}
