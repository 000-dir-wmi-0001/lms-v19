import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment'; 
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  constructor(private http: HttpClient) {}

 createCertRequest(data:any){
    return this.http.post(`${environment.api}/certificate/createCertificate`,data)
 }
 getRequest(){
  return this.http.get(`${environment.api}/certificate/readRequest`);
 }
 
 getSpecificRequest(id:any){
  return this.http.post(`${environment.api}/certificate/getSpecificRequest`,{id:id});
}
deleteRequest(id:any){
  return this.http.delete(`${environment.api}/certificate/deleteRequest/${id}`);
}
approveRequest(id:any,status:any){
  return this.http.put((`${environment.api}/certificate/approverequest/`),{id:id,status:status});
}

getUploadUrlCerti(userId:any,certId:any){
  return this.http.post(`${environment.api}/certificate/getUploadURLCerti`,{userId:userId,certId:certId})
}

getDownloadURLCerti(userId:any,certId:any){
  return this.http.post(`${environment.api}/certificate/getDownloadURLCerti`,{userId:userId,certId:certId})
}

getSpecificCert(id:any){
  return this.http.get(`${environment.api}/certificate/getSpecificCert/${id}`);
}

deleteCertFile(userId:any,certId:any){
  return this.http.post(`${environment.api}/certificate/deleteCertFile`,{userId:userId,certId:certId})
}
}