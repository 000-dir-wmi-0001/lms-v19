import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { param } from 'jquery';
// import { Batch  } from './batch.model';

// Define a Batch interface (optional but good for typing)
export interface Batch {
  _id?: string;
  name: string;
  description?: string;
  startFrom?: Date;
  endAt?: Date;
  moduleId?: string;
  createdAt?: Date;
  module?: any;
}

// Define a new interface for the batch response
export interface BatchWithStudents {
  [x: string]: any;
  batch: Batch; // Batch object
  students: any[]; // Array of students in the batch
}

export interface BatchResponse {
  message: string;
  batch: Batch; // Batch object inside the response
}
@Injectable({
  providedIn: 'root',
})
export class BatchService {
  onSubmit() {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) { }
  private token = localStorage.getItem('token');


  // Add a new batch
  addBatch(uri: string, batchData: Batch): Observable<BatchResponse> {
    return this.http.post<BatchResponse>(`${environment.api}/${uri}/${batchData.moduleId}`, {
      ...batchData,
    },
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  // Get all batches
  getBatches(uri: string): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${environment.api}/${uri}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  // Updated method in BatchService
  getBatchById(uri: string): Observable<BatchWithStudents> {
    return this.http.get<BatchWithStudents>(`${environment.api}/${uri}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }
  // Update a batch
  updateBatch(uri: string, batch: Batch): Observable<Batch> {
    return this.http.put<Batch>(
      `${environment.api}/${uri}/${batch._id}`,
      batch,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }

  // Delete a batch
  deleteBatch(uri: string, batchId: string): Observable<BatchResponse> {
    return this.http.delete<BatchResponse>(`${environment.api}/${uri}/${batchId}`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  ///////////////////////////////////////////////////////////

  // Add a student to a batch
  addStudentToBatch(batchId: string, userId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.api}/batches/add-student/${batchId}/${userId}`,
      { batchId, userId }
      ,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  // Function to remove a student from a batch
  removeStudentFromBatch(batchId: string, userId: string): Observable<any> {
    return this.http.delete(
      `${environment.api}/batches/batch/${batchId}/student/${userId}`
      ,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

  getUsersBatches(userId: string) {
    return this.http.get(`${environment.api}/batches/user/${userId}/batches`,
      { headers: { Authorization: `Bearer ${this.token}` } }
    );
  }

}
