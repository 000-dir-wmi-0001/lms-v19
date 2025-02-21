import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor(private http: HttpClient) { }
  setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }

  public courses() {
    return this.http.get(`${environment.api}/course/`)
  }
  //add course
  public addCourse(name: string, category: string, price: number, description: string, thumbnail: string) {
    return this.http.post(`${environment.api}/course/addCourse`, { name, category, price, description, thumbnail });
  }

  //get single course
  public getCourse(courseId: any) {
    return this.http.get(`${environment.api}/course/getCourse/${courseId}`)
  }

  //update course details
  public updateCourse(courseId: any, course: any) {
    return this.http.put(`${environment.api}/course/updateCourse/${courseId}`, course);
  }

  //delete course
  public deleteCourse(courseId: any) {
    return this.http.delete(`${environment.api}/course/deleteCourse/${courseId}`);

  }

  //add lecture
  public addLecture(name: any, video: FormData, courseId: any) {
    return this.http.post(`${environment.api}/lecture/addLecture`, { name, video });
  }

  public getCart(userId: any) {
    return this.http.get(`${environment.api}/cart/${userId}`);
  }

  //add course to cart
  public addToCart(courseId: any, userId: any) {
    return this.http.post(`${environment.api}/cart/${userId}`, { courseId });
  }

  public removeItem(courseId: any, userId: any) {
    return this.http.delete(`${environment.api}/cart/${userId}/${courseId}`);
  }

  //getLecture
  public getLecture(_id: any) {
    return this.http.get(`${environment.api}/lecture/getLectureInfo/${_id}`);
  }

  //getVideoUrl
  public getVideo(courseId: any, id: any, filename: any) {
    return this.http.get(`${environment.api}/lecture/${courseId}/${id}/${filename}`)
  }

  //get video thumbnail
  public getVideoThumbnail(courseId: any, id: any, filename: any) {
    return this.http.get(`${environment.api}/lecture/thumbnail/${courseId}/${id}/${filename}`)
  }

  //getThumbnailUrl
  public getThumbnail(id: any, filename: any) {
    return this.http.get(`${environment.api}/course/getThumbnail/${id}/${filename}`)
  }


  //delete Lecture
  public deleteLecture(id: any, cid: any) {
    return this.http.delete(`${environment.api}/lecture/deleteLecture/${id}/${cid}`)
  }

  public createOrder(amount: number, courses: any, userId: any) {
    const data = { amount, courses, userId };
    return this.http.post(`${environment.api}/payment/createPayment`, data).pipe(
      map((response: any) => response)
    );
  }

  public verifyPayment(paymentId: any, orderId: any, signature: any) {
    const data = { paymentId, orderId, signature };
    return this.http.post(`${environment.api}/payment/webhook`, data);
  }

}

