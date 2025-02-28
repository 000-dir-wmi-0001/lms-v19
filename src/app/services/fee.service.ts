import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class FeeService {
  constructor(private http: HttpClient) { }

  serviceStudentList: any = [];
  serviceFeeList: any = [];
  private token = localStorage.getItem('token');

  getFeeList() {
    return this.http.get(`${environment.api}/fee/getfees/`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  getStudentUser() {
    return this.http.get(`${environment.api}/fee/getStudentUser`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  setFee(
    firstName: string,
    lastName: string,
    totalFee: number,
    paymentMode: string
  ) {
    return this.http.post(`${environment.api}/fee/setFee`, {
      firstName,
      lastName,
      totalFee,
      paymentMode,
    },
    { headers: { Authorization: `Bearer ${this.token}` } }
  );
  }
  searchStudent(query: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.api}/fee/searchStudent?q=${query}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  getUserFee(id: any) {
    return this.http.get(`${environment.api}/fee/getUserFee/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  editUserFee(id: any, data: any) {
    return this.http.put(`${environment.api}/fee/updateFee/${id}`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  getAllCourses() {
    return this.http.get(`${environment.api}/course/`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  editCoursePrice(id: any, newPrice: any) {
    return this.http.put(`${environment.api}/course/editCoursePrice/${id}`, { price: newPrice },
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
  getALlStaticCourses() {
    return this.http.get(`${environment.api}/staticCourse/readCourse`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  createStaticCourse(data: any) {
    return this.http.post(`${environment.api}/staticCourse/createCourse`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
  editStaticCoursePrice(id: any, newPrice: any) {
    return this.http.put(`${environment.api}/staticCourse/updateCourse`, { id: id, price: newPrice },
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
  getFeesStud(id: any) {
    return this.http.get(`${environment.api}/fee/getFeesStud/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

}
