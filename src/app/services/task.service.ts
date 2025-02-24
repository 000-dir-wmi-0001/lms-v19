import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { shareReplay, tap} from 'rxjs/operators';
import {  HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../dashboard/task/task.model';
@Injectable({
  providedIn: 'root'
})
export class TaskService {

  
  constructor(private http: HttpClient,private authService: AuthService,private router: Router) {
    
   }

   /*getTasks(uri: String,user_id: string | any, token: string | any){
   
    return this.http.post(`${environment.api}/${uri}`,{ token: token, user_id: user_id })

  }*/

  getTasks(uri: String, token: string | any){
   
    return this.http.post(`${environment.api}/${uri}`,{ token: token })

  }

   // Example getTask function
   getTask(uri: string, token: string | any, taskId: string) {
    return this.http.post(`${environment.api}/${uri}`, { token: token, taskId: taskId });
  }
  addTasks(uri: String, token: string | any, title: string){
    return this.http.post(`${environment.api}/${uri}`,{ token: token, title: title })
  }

  /*updateTasks(uri: string,user_id: string | any, token: string | any, title: string){
    return this.http.patch(`${environment.api}/${uri}`,{ token: token, user_id: user_id, title: title })
  }*/

  updateTasks(
   
    
    _id: string ,
    newTitle: string
  ): Observable<Task> {
    const requestBody = {
     
      title: newTitle
    };

    const url = `${environment.api}/task/${_id}`;
    console.log("id"+_id);
    return this.http.patch<Task>(url, requestBody);
  }

  deleteList(_id: string) {
    return this.http.delete(`${environment.api}/task/${_id}`);
  }


  login(email: string, password: string){
    return this.authService.signIn(email,password).pipe(
       shareReplay(),
       tap((res: HttpResponse<any>) => {
         //the auth tokens will be in the header of this response
         this.setSession(res.body._id,res.headers.get('token') ?? '');
         console.log("logged in!");
         console.log(res);
       })
     )
   }
 
   signup(firstName: string,lastName: string,email: string, password: string,mobileno:number){
     return this.authService.register(firstName,
      lastName,
      email,
      password,mobileno).pipe(
        shareReplay(),
        tap((res: HttpResponse<any>) => {
          //the auth tokens will be in the header of this response
          //this.setSession(res.body._id,res.headers.get('token') ?? '');
          console.log("sign up");
          console.log(res);
        })
      )
    }
 
   
 
   getAccessToken() {
     return localStorage.getItem('token');
   }
 
   
 
   getUserId() {
     return localStorage.getItem('user-id');
   }
 
   setAccessToken(accessToken: string) {
     localStorage.setItem('token', accessToken)
   }
 
   private setSession(userId: string, accessToken: string){
   localStorage.setItem('user-id', userId);
   
   if (accessToken !== null) {
     localStorage.setItem('token', accessToken);
   }
 
   
 }
 
   
 
}
