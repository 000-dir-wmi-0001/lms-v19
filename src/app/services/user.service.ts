import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  private token = localStorage.getItem('token');
  // { headers: { Authorization: `Bearer ${this.token}` } }

  public users() {
    return this.http.get(`${environment.api}/user/`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }

  // addUser(firstName: string, lastName: string, email: string, phone: any, type: string, batchno: string, status: string)
  // addUser(firstName: string, lastName: string, email: string, type: string, batchno: string, status: string) {
  //   return this.http.post(`${environment.api}/user/addUser`, { firstName, lastName, email, type, batchno, status });
  // }

  addUser(firstName: string, lastName: string, email: string, phone: any, type: string, batchno?: any, moduleno?: any, status?: string) {

    return this.http.post(`${environment.api}/user/addUser`, { firstName, lastName, email, phone, type, batchno, moduleno, status },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  getUsers() {
    return this.http.get(`${environment.api}/user/`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  getUser(userId: any) {
    return this.http.get(`${environment.api}/user/getUser/${userId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  deleteUser(userId: any) {
    return this.http.delete(`${environment.api}/user/deleteUser/${userId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  createStudentAcademicDetails(data: any, id: any) {
    return this.http.post(`${environment.api}/user/createStudentAcademicDetails/${id}`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  requestEditOrCancel(id: any, action: string) {
    return this.http.patch(`${environment.api}/user/request-editProfile/${id}`, { action },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  updateProfileEditStatus(id: any, status: string) {
    const payload = { editStatus: status };
    return this.http.patch(`${environment.api}/user/updateProfileEditStatus/${id}`, payload,
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }

  updateUser(data: any, id: any) {
    console.log(data, "data to save userprofile details");

    return this.http.put(`${environment.api}/user/updateUser/${id}`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  updateStatus(statusToUpdate: any) {
    return this.http
      .patch(`${environment.api}/user/Userstatus`, { statusToUpdate },
        { headers: { Authorization: `Bearer ${this.token}` } }
      )
      .subscribe(
        (response) => {
          console.log('Status updated successfully:frontend', response);
        },
        (error) => {
          console.error('Error while updating status: frontend', error);
        }
      );
  }
  getStudentAcademicDetails(id: any) {

    return this.http.get(`${environment.api}/user/getStudentAcademicDetails/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  updateIsVerified(data: any, id: any) {
    return this.http.put(`${environment.api}/user/updateIsVerified/${id}`, { data: data },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }
  changeStudentPasswordFromProfile(id: any, data: any) {
    return this.http.post(`${environment.api}/user/changeStudentPasswordFromProfile/${id}`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }
  getUploadURLProfilePicture(id: any) {

    return this.http.post(`${environment.api}/user/getUploadURLProfilePicture`, { id: id },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }
  getDownloadURLProfilePicture(id: any) {
    return this.http.post(`${environment.api}/user/getDownloadURLProfilePicture`, { id: id },
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }
  getALlStaticCourses() {
    return this.http.get(`${environment.api}/staticCourse/readCourse`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  getPaymentDetails(id: any) {
    return this.http.get(`${environment.api}/user/getPaymentDetails/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  addModulesfromAdmin(id: any, data: any) {
    console.log(data, "from service");
    return this.http.post(`${environment.api}/user/addModulesfromAdmin/${id}`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  getAvailableModulesofUserforPaymentModule(id: any) {
    return this.http.get(`${environment.api}/user/getAvailableStaticCoursesIds/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  getUserName(userId: any) {
    return this.http.get(`${environment.api}/user/getUserName/${userId}`)
  }

  getSpecificStudent(id: string): Observable<any> {
    // console.log('Fetching user with ID:', id);  // Debugging log
    return this.http.get(`${environment.api}/user/getUser/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  getInstructors(): Observable<any> {
    return this.http.get(`${environment.api}/instructors`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  getProfilePhoto(filename: string): string {
    return `${environment.api}/profile-photo/${filename}`;
  }


  //Fetching all modules
  getAllBatches() {
    return this.http.get(`${environment.api}/batches/list/`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  getAllModules() {
    return this.http.get(`${environment.api}/module/`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  //fetching all Batches by module Ids
  getAllBatchByModuleIds(body: any) {
    //headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);

    //POST request with the headers and body passed in the options object
    return this.http.post(`${environment.api}/batches/batch-list-module`, body, { headers: headers });
  }


  addNewModule(module: any) {
    return this.http.post(`${environment.api}/module/`, module,
      { headers: { Authorization: `Bearer ${this.token}` } }
    )
  }
  // addNewModule(module: any) {
  //   return this.http.post(`${environment.api}/addModulesfromAdmin/${module._id}`, module,
  //     { headers: { Authorization: `Bearer ${this.token}` } }
  //   )
  // }

}
