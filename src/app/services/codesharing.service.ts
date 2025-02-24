import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CodesharingService {

  constructor(private http:HttpClient) { }

  public getUploadURL(name:string, title:string, description:string, language: string){
    return this.http.post(environment.api + '/file/getUploadURL/' + name, {title, description, language })
  }

   //get all files metadata
   public getAllFiles() {
    return this.http.get(`${environment.api}/file/getFiles`);
  }

  //get file Download Url
  public getDownloadUrl(id:any, user:any, name:any){
    return this.http.post(`${environment.api}/file/getDownloadURL`,{id, user, name});
  }

  public deleteFile(id:any, user:any, name:any){
    return this.http.post(`${environment.api}/file/deleteFile`, {id, user, name});
  }
}
