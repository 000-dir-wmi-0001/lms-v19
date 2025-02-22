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

  getFeeList() {
    return this.http.get(`${environment.api}/fee/getfees/`);
  }
  getStudentUser() {
    return this.http.get(`${environment.api}/fee/getStudentUser`);
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
    });
  }
  searchStudent(query: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.api}/fee/searchStudent?q=${query}`
    );
  }

  getUserFee(id: any) {
    return this.http.get(`${environment.api}/fee/getUserFee/${id}`);
  }
  editUserFee(id: any, data: any) {
    return this.http.put(`${environment.api}/fee/updateFee/${id}`, data);
  }

  getAllCourses() {
    return this.http.get(`${environment.api}/course/`);
  }
  editCoursePrice(id: any, newPrice: any) {
    return this.http.put(`${environment.api}/course/editCoursePrice/${id}`, { price: newPrice })
  }
  getALlStaticCourses() {
    return this.http.get(`${environment.api}/staticCourse/readCourse`);
  }
  createStaticCourse(data: any) {
    return this.http.post(`${environment.api}/staticCourse/createCourse`, data)
  }
  editStaticCoursePrice(id: any, newPrice: any) {
    return this.http.put(`${environment.api}/staticCourse/updateCourse`, { id: id, price: newPrice })
  }
  getFeesStud(id: any) {
    return this.http.get(`${environment.api}/fee/getFeesStud/${id}`);
  }

}
