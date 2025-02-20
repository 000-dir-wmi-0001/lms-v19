import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})


export class AuthService {

  userData: any
  constructor(private readonly http: HttpClient) { }

  register(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    mobileno: number
  ): Observable<any> {
    return this.http.post(`${environment.api}/user/register`, {
      firstName,
      lastName,
      email,
      password,
      mobileno
    }, { observe: 'response' });
  }

  setUserData(data: any) {
    this.userData = data;
    console.log(this.userData);
  }

  getUserData() {
    return this.userData;
  }


  sendOtp(email: string) {
    return this.http.post(`${environment.api}/user/sendOtp`, { email })
  }

  verifyOtpAndRegister(data: any) {
    return this.http.post(`${environment.api}/user/verifyOtpAndRegister`, data)
  }

  resendOtp(email: any) {
    return this.http.patch(`${environment.api}/user/resendOtp`, { email })
  }

  approveUser(userId: any) {
    return this.http.patch(`${environment.api}/user/approve/${userId}`, {})
  }


  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.api}/user/login`, { email, password });
  }
  forgotPassword(email: string) {
    return this.http.post(`${environment.api}/user/forgetpassword`, { email });
  }
  resetPassword(token: string, password: string) {
    return this.http.put(environment.api + '/user/resetpassword', { token, password });
  }
  enquiry(
    fullName: string,
    phoneNumber: number,
    email: string = "",
    source: 'WEBSITE_FORM' | 'BROCHURE' | 'POPUP_MODAL' | 'MANUAL_ENTRY',
    courseEnrolledIn: Array<string> = [],
    status: string = "Pending",
    enqDescription: string = "",
    //  source: 'WEBSITE_FORM' | 'BROCHURE' | 'POPUP_MODAL' | 'MANUAL_ENTRY'
  ): Observable<any> {
    return this.http.post(`${environment.api}/user/enquiry`, {
      fullName,
      phoneNumber,
      email,
      source,
      courseEnrolledIn,
      status,
      enqDescription,
    });
  }

  getenquiry(page: number): Observable<any> {
    return this.http.get(`${environment.api}/user/enquiry?page=${page}&limit=10`);
  }

  deleteEnquiry(id: any) {
    return this.http.delete(`${environment.api}/user/enquiry/` + id);
  }

  updateStatus(dataToUpdate: any) {
    return this.http
      .patch(`${environment.api}/user/status`, { dataToUpdate })

  }

  updateReview(reviewToUpdate: any) {
    return this.http
      .patch(`${environment.api}/user/review`, { reviewToUpdate })
  }

  verifyUser(token: any) {
    return this.http.post(`${environment.api}/user/userVerify`, { token });
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }
// }
