import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private token = localStorage.getItem('token');

  topic: string = ''
  private isAddByLLM = false;
  constructor(private http: HttpClient) { }






  public addExam(name: string, type: string, startDate: string, courseId: string, instructorId: any, startTime: any, endTime: any) {
    return this.http.post(`${environment.api}/exam/`, { name, type, startDate, courseId, instructorId, startTime, endTime },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public addverbalquestion(name: String, marks: any, examId: any) {
    return this.http.post(`${environment.api}/verbal_question/`, { name, marks, examId },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getExams() {
    return this.http.get(`${environment.api}/exam/`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getUser() {
    return this.http.get(`${environment.api}/user/`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getCourse() {
    return this.http.get(`${environment.api}/course/`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getcourseDropDownValue() {
    return this.http.get(`${environment.api}/course/`,

      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public addquestion(question: string, options: Array<String>, answers: Array<String>, mark: any, examId: string) {
    return this.http.post(`${environment.api}/question/`, { question, options, answers, mark, examId },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getMCQQuestions(examId: any) {
    console.log(`get mcq ${examId}`)
    return this.http.get(`${environment.api}/question/exam/${examId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getCODINGQuestions(examId: any) {
    return this.http.get(`${environment.api}/compiler/exam/${examId}`,

    );      { headers: { Authorization: `Bearer ${this.token}` } }

  }

  public getVERBALQuestions(examId: any) {
    return this.http.get(`${environment.api}/verbal_question/exam/${examId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public SubmitVERBALQuestions(examId: any, studId: any, questionId: any, recording: any) {
    return this.http.post(`${environment.api}/record/`, { examId, studId, questionId, recording },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public deleteExam(id: any) {
    return this.http.delete(`${environment.api}/exam/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public deleteCompilerQuestion(examId: any, questionId: any) {
    return this.http.delete(`${environment.api}/compiler/${examId}/${questionId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getResult(sid: any, eid: any) {
    return this.http.get(`${environment.api}/attempt/${sid}/${eid}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getQuestionsforStudent(examId: any) {
    return this.http.get(`${environment.api}/question/exam/${examId}/studentllm`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public postanswer(examId: any, questionId: any, studId: any, answersSelected: Array<String>) {
    return this.http.post(`${environment.api}/attempt/`, { questionId, examId, studId, answersSelected },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public deleteQuestion(examId: any, questionId: any) {
    return this.http.delete(`${environment.api}/question/${examId}/${questionId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public deletecodingQuestion(examId: any, questionId: any) {
    return this.http.delete(`${environment.api}/compiler/${examId}/${questionId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public addcode(script: any, language: any) {
    return this.http.post(`${environment.api}/compiler/`, { script, language },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public addcodingquestion(language: any, question: any, description: any, editable: any, nonEditable: any, marks: any, numberOfTestCases: any, examId: any) {
    return this.http.post(`${environment.api}/compiler/add/`, { language, question, description, editable, nonEditable, marks, numberOfTestCases, examId },
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getCODINGquestionbyid(id: any) {
    return this.http.get(`${environment.api}/compiler/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public postVerbalanswer(form: any) {
    return this.http.post(`${environment.api}/record/`, form,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public checkAtteptedorNot(examId: any, studentId: any) {
    return this.http.get(`${environment.api}/attempt/result/${studentId}/${examId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public ViewStudentAttemptedVerbalExam(examId: any) {
    return this.http.get(`${environment.api}/record/${examId}/students`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  public getVerbalResultForStudent(examId: any, studentId: any) {
    return this.http.get(`${environment.api}/record/${examId}/${studentId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  private startTime!: string;
  private endTime!: string;

  setExamTimes(start: string, end: string): void {
    this.startTime = start;
    this.endTime = end;
  }

  getStartTime(): string {
    return this.startTime;
  }

  getEndTime(): string {
    return this.endTime;
  }



  setExamTopic(topicName: string) {
    this.topic = topicName
  }

  setAddByLLMFlag(flag: boolean): void {
    this.isAddByLLM = flag;
  }

  getAddByLLMFlag(): boolean {
    return this.isAddByLLM;
  }




  getExamTopic() {   /* For getting id and password to start/join the meeting */
    return {
      topicName: this.topic
    }
  }

  //generate-mcq by llm

  generateMcqByLLM(topic: string, difficulty: string) {
    const body = { topic, difficulty };
    console.log(body.topic, body.difficulty)
    return this.http.post(`${environment.api}/question/generate-mcqs`, body);


  }


  saveMcqToLLM(mcqData: any, examId: string) {
    const payload = {
      ...mcqData, // Includes `topic`, `difficulty`, and `questions`
      examId,     // Pass `examId` as part of the payload
    };

    console.log("Save mcqData from savmcqToLLM service", payload);

    return this.http.post<any>(`${environment.api}/question/save-mcq`, payload);
  }

  getExamDetails(examId: string) {
    return this.http.get(`${environment.api}/question/exams/${examId}/details`)
  }


  fetchMcqs(examId: any) {
    // Add query parameter for topic
    console.log("examid", examId)
    return this.http.get(`${environment.api}/question/fetch-mcqs/${examId}`);

  }
  public updatellmQuestion(
    questionId: string,
    name: string,
    options: string[],
    answers: string[],
    mark: number,
    examId: any
  ) {
    return this.http.patch(
      `${environment.api}/question/update-question/${examId}/${questionId}`, // Correct URL without `examId`
      { name, options, answers, mark }
    );
  }


  deletellmQuestion(questionId: any) {
    // Make a DELETE request with questionId in the URL and examId in the request body
    return this.http.delete(`${environment.api}/question/delete-question/${questionId}`);

  }

  recordResult(examId: any, studentId: any, obtainedMarks: any,) {
    return this.http.post(`${environment.api}/record/result`, { examId, studentId, obtainedMarks })
  }

  getMcqMarks(id: any) {
    // Pass examid as a query parameter
    console.log("id from getmcqservice", id);

    return this.http.get(`${environment.api}/record/result/${id}`);
  }













}
