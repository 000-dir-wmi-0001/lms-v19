import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})


export class AuthService {

  private token = localStorage.getItem('token');

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
    }, { observe: 'response' , headers: { Authorization: `Bearer ${this.token}` } }
  );
  }

  setUserData(data: any) {
    this.userData = data;
    console.log(this.userData);
  }

  getUserData() {
    return this.userData;
  }


  sendOtp(email: string) {
    return this.http.post(`${environment.api}/user/sendOtp`, { email },
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }

  verifyOtpAndRegister(data: any) {
    return this.http.post(`${environment.api}/user/verifyOtpAndRegister`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }

  resendOtp(email: any) {
    return this.http.patch(`${environment.api}/user/resendOtp`, { email },
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }

  approveUser(userId: any) {
    return this.http.patch(`${environment.api}/user/approve/${userId}`, {},
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }


  signIn(email: string, password: string): Observable<any> {
    return this.http.post(`${environment.api}/user/login`, { email, password },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  forgotPassword(email: string) {
    return this.http.post(`${environment.api}/user/forgetpassword`, { email },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  resetPassword(token: string, password: string) {
    return this.http.put(environment.api + '/user/resetpassword', { token, password },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
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
    },
    { headers: { Authorization: `Bearer ${this.token}` } }
  );
  }

  getenquiry(page: number): Observable<any> {
    return this.http.get(`${environment.api}/user/enquiry?page=${page}&limit=10`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  deleteEnquiry(id: any) {
    return this.http.delete(`${environment.api}/user/enquiry/` + id,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  updateStatus(dataToUpdate: any) {
    return this.http
      .patch(`${environment.api}/user/status`, { dataToUpdate },
        { headers: { Authorization: `Bearer ${this.token}` } }

      )

  }

  updateReview(reviewToUpdate: any) {
    return this.http
      .patch(`${environment.api}/user/review`, { reviewToUpdate },
        { headers: { Authorization: `Bearer ${this.token}` } }

      )
  }

  verifyUser(token: any) {
    return this.http.post(`${environment.api}/user/userVerify`, { token },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {

//   constructor() { }
// }
