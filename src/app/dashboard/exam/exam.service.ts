import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ExamService {

  constructor(private http: HttpClient) { }


  public addExam(name: string, type: string, startDate: string, courseId: String) {
    return this.http.post(`${environment.api}/exam/`, { name, type, startDate, courseId });
  }

  public getExam() {
    return this.http.get(`${environment.api}/exam/`);
  }

  public getUser() {
    return this.http.get(`${environment.api}/user/`);
  }

  public getCourse() {
    return this.http.get(`${environment.api}/course/`);
  }

  public getcourseDropDownValue() {
    return this.http.get(`${environment.api}/course/`);
  }

  public addquestion(name: string, options: Array<String>, answers: Array<String>, mark: any, examId: string) {
    return this.http.post(`${environment.api}/question/`, { name, options, answers, mark, examId });
  }

  public getQuestions(examId: any) {
    return this.http.get(`${environment.api}/question/exam/${examId}`);
  }

  public getQuestionsforStudent(examId: any) {
    return this.http.get(`${environment.api}/question/exam/${examId}/student`);
  }

  public postanswer(questionId: any, examId: any, studId: any, answersSelected: Array<String>) {

    return this.http.post(`${environment.api}/attempt/`, { questionId, examId, studId, answersSelected });
  }


  public getResult(sid: any, eid: any) {
    return this.http.get(`${environment.api}/attempt/${sid}/${eid}`);
  }

  public updateQuestion(_id: any, name: any, options: Array<String>, answers: Array<String>, mark: Number) {
    return this.http.put(`${environment.api}/question/${_id}`, { name, options, answers, mark });
  }

  public deleteQuestion(examId: any, questionId: any) {
    return this.http.delete(`${environment.api}/question/${examId}/${questionId}`,);
  }

  public addverbalquestion(name: String, examId: any): Observable<any> {
    return this.http.post(`${environment.api}/verbal_question/`, { name, examId });
  }





}

