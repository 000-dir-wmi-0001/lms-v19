import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

 createCertRequest(data:any){
    return this.http.post(`${environment.api}/certificate/createCertificate`,data,
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
 }
 getRequest(){
  return this.http.get(`${environment.api}/certificate/readRequest`,
    { headers: { Authorization: `Bearer ${this.token}` } }

  );
 }

 getSpecificRequest(id:any){
  return this.http.post(`${environment.api}/certificate/getSpecificRequest`,{id:id},
    { headers: { Authorization: `Bearer ${this.token}` } }

  );
}
deleteRequest(id:any){
  return this.http.delete(`${environment.api}/certificate/deleteRequest/${id}`,
    { headers: { Authorization: `Bearer ${this.token}` } }

  );
}
approveRequest(id:any,status:any){
  return this.http.put((`${environment.api}/certificate/approverequest/`),{id:id,status:status},
  { headers: { Authorization: `Bearer ${this.token}` } }
);
}

getUploadUrlCerti(userId:any,certId:any){
  return this.http.post(`${environment.api}/certificate/getUploadURLCerti`,{userId:userId,certId:certId},
    { headers: { Authorization: `Bearer ${this.token}` } }

  )
}

getDownloadURLCerti(userId:any,certId:any){
  return this.http.post(`${environment.api}/certificate/getDownloadURLCerti`,{userId:userId,certId:certId},
    { headers: { Authorization: `Bearer ${this.token}` } }

  )
}

getSpecificCert(id:any){
  return this.http.get(`${environment.api}/certificate/getSpecificCert/${id}`,
    { headers: { Authorization: `Bearer ${this.token}` } }

  );
}

deleteCertFile(userId:any,certId:any){
  return this.http.post(`${environment.api}/certificate/deleteCertFile`,{userId:userId,certId:certId},
    { headers: { Authorization: `Bearer ${this.token}` } }

  )
}
}
