import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class CourseService {
  constructor(private http: HttpClient) { }
  // Get all courses with thumbnail URLs

  private token = localStorage.getItem('token');

  public courses() {
    return this.http.get(`${environment.api}/course/`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).pipe(
      map((response: any) => {
        if (response.courses) {
          return {
            ...response,
            courses: response.courses.map((course: any) => ({
              ...course,
              url: course.thumbnail ?
                `${environment.api}/course/getThumbnail/${course._id}/${course.thumbnail}` :
                null
            }))
          };
        }
        return response;
      })
    );
  }


  // Get course thumbnail URL
  public getCourseThumbnail(courseId: string, fileName: string): Observable<string> {
    return this.http.get<string>(
      `${environment.api}/course/getThumbnail/${courseId}/${fileName}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  // Add course with thumbnail
  public addCourse(name: string, category: string, price: number, description: string, thumbnail: string) {
    return this.http.post(`${environment.api}/course/addCourse`, {
      name,
      category,
      price,
      description,
      thumbnail
    },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  // Get upload URL for thumbnail
  public getUploadURL(key: string) {
    return this.http.post(`${environment.api}/course/getUploadURL/${key}`, {},
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  // Add thumbnail to course
  public addThumbnail(id: string, filename: string) {
    return this.http.get(`${environment.api}/course/addThumbnail/${id}/${filename}`).pipe(
      map((response: any) => {
        if (response.thumbnail_url) {
          return {
            ...response,
            url: response.thumbnail_url
          };
        }
        return response;
      })
    );
  }

  // Get single course with thumbnail
  public getCourse(courseId: string) {
    return this.http.get(`${environment.api}/course/getCourse/${courseId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).pipe(
      map((response: any) => {
        if (response.course && response.course.thumbnail) {
          return {
            ...response,
            course: {
              ...response.course,
              url: `${environment.api}/course/getThumbnail/${courseId}/${response.course.thumbnail}`
            }
          };
        }
        return response;
      })
    );
  }

  // Get user courses with thumbnails
  public getUserCourses(courseIds: string) {
    return this.http.get(`${environment.api}/course/getuserCourses/${courseIds}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    ).pipe(
      map((response: any) => {
        if (response.course) {
          return {
            ...response,
            course: response.course.map((course: any) => ({
              ...course,
              url: course.thumbnail ?
                `${environment.api}/course/getThumbnail/${course._id}/${course.thumbnail}` :
                null
            }))
          };
        }
        return response;
      })
    );
  }

  // Keep your existing methods unchanged
  public getUserModules(moduleIds: any) {
    return this.http.get(`${environment.api}/staticCourse/getUserModules/${moduleIds}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getModulewithName(name: any) {
    return this.http.get(`${environment.api}/staticCourse/getModulebyName/${name}`),
    { headers: { Authorization: `Bearer ${this.token}` } }

  }

  public updateCourse(courseId: any, course: any) {
    return this.http.put(`${environment.api}/course/updateCourse/${courseId}`, course,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  public deleteCourse(courseId: any) {
    return this.http.delete(`${environment.api}/course/deleteCourse/${courseId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public addLecture(name: any, description: any, video: any, courseId: any) {
    return this.http.post(`${environment.api}/course/${courseId}/add`, { name, description, video },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getLecture(_id: any) {
    return this.http.get(`${environment.api}/lecture/getLectureInfo/${_id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public updateLecture(title: any, description: any, key: any, courseId: any, lecture: any) {
    return this.http.put(`${environment.api}/lecture/updateLecture/${lecture}/${courseId}`,
      { title, description, key },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public createOrder(amount: number, module: any, userId: any) {
    return this.http.post(`${environment.api}/static_courses/createPayment`,
      { amount, module, userId },
      { headers: { Authorization: `Bearer ${this.token}` } }

    ).pipe(
      map((response: any) => response)
    );
  }

  public verifyPayment(paymentId: any, orderId: any, signature: any) {
    return this.http.post(`${environment.api}/static_courses/webhook`,
      { paymentId, orderId, signature },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
}
