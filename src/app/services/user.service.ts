import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public users() {
    return this.http.get(`${environment.api}/user/`)
  }

  addUser(firstName: string, lastName: string, email: string, type: string, batchno: string, status: string) {
    return this.http.post(`${environment.api}/user/addUser`, { firstName, lastName, email, type, batchno, status });
  }

  getUsers() {
    return this.http.get(`${environment.api}/user/`);
  }

  getUser(userId: any) {
    return this.http.get(`${environment.api}/user/getUser/${userId}`);
  }

  deleteUser(userId: any) {
    return this.http.delete(`${environment.api}/user/deleteUser/${userId}`);
  }

  createStudentAcademicDetails(data: any, id: any) {
    return this.http.post(`${environment.api}/user/createStudentAcademicDetails/${id}`, data);
  }

  requestEditOrCancel(id: any, action: string) {
    return this.http.patch(`${environment.api}/user/request-editProfile/${id}`, { action });
  }

  updateProfileEditStatus(id: any, status: string) {
    const payload = { editStatus: status };
    return this.http.patch(`${environment.api}/user/updateProfileEditStatus/${id}`, payload)
  }

  updateUser(data: any, id: any) {
    console.log(data, "data to save userprofile details");

    return this.http.put(`${environment.api}/user/updateUser/${id}`, data);
  }
  updateStatus(statusToUpdate: any) {
    return this.http
      .patch(`${environment.api}/user/Userstatus`, { statusToUpdate })
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

    return this.http.get(`${environment.api}/user/getStudentAcademicDetails/${id}`);
  }
  updateIsVerified(data: any, id: any) {
    return this.http.put(`${environment.api}/user/updateIsVerified/${id}`, { data: data })
  }
  changeStudentPasswordFromProfile(id: any, data: any) {
    return this.http.post(`${environment.api}/user/changeStudentPasswordFromProfile/${id}`, data)
  }
  getUploadURLProfilePicture(id: any) {

    return this.http.post(`${environment.api}/user/getUploadURLProfilePicture`, { id: id })
  }
  getDownloadURLProfilePicture(id: any) {
    return this.http.post(`${environment.api}/user/getDownloadURLProfilePicture`, { id: id })
  }
  getALlStaticCourses() {
    return this.http.get(`${environment.api}/staticCourse/readCourse`);
  }
  getPaymentDetails(id: any) {
    return this.http.get(`${environment.api}/user/getPaymentDetails/${id}`);
  }
  addModulesfromAdmin(id: any, data: any) {
    console.log(data, "from service");
    return this.http.post(`${environment.api}/user/addModulesfromAdmin/${id}`, data);
  }
  getAvailableModulesofUserforPaymentModule(id: any) {
    return this.http.get(`${environment.api}/user/getAvailableStaticCoursesIds/${id}`);
  }

  getUserName(userId: any) {
    return this.http.get(`${environment.api}/user/getUserName/${userId}`)
  }

  getSpecificStudent(id: string): Observable<any> {
    console.log('Fetching user with ID:', id);  // Debugging log
    return this.http.get(`${environment.api}/user/getUser/${id}`);
  }

  getInstructors(): Observable<any> {
    return this.http.get(`${environment.api}/instructors`);
  }
  getProfilePhoto(filename: string): string {
    return `${environment.api}/profile-photo/${filename}`;
  }

}
