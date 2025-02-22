import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
// import { Batch  } from './batch.model';

// Define a Batch interface (optional but good for typing)
export interface Batch {
  _id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
}

// Define a new interface for the batch response
export interface BatchWithStudents {
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

  // Add a new batch
  addBatch(uri: string, batchData: Batch): Observable<BatchResponse> {
    return this.http.post<BatchResponse>(`${environment.api}/${uri}`, {
      ...batchData,
    });
  }

  // Get all batches
  getBatches(uri: string): Observable<Batch[]> {
    return this.http.get<Batch[]>(`${environment.api}/${uri}`);
  }

  // Updated method in BatchService
  getBatchById(uri: string): Observable<BatchWithStudents> {
    return this.http.get<BatchWithStudents>(`${environment.api}/${uri}`);
  }
  // Update a batch
  updateBatch(uri: string, batch: Batch): Observable<Batch> {
    return this.http.put<Batch>(
      `${environment.api}/${uri}/${batch._id}`,
      batch
    );
  }

  // Delete a batch
  deleteBatch(uri: string, batchId: string): Observable<BatchResponse> {
    return this.http.delete<BatchResponse>(`${environment.api}/${uri}/${batchId}`);
  }

  ///////////////////////////////////////////////////////////

  // Add a student to a batch
  addStudentToBatch(batchId: string, userId: string): Observable<any> {
    return this.http.post<any>(
      `${environment.api}/batches/add-student/${batchId}/${userId}`,
      { batchId, userId }
    );
  }

  // Function to remove a student from a batch
  removeStudentFromBatch(batchId: string, userId: string): Observable<any> {
    return this.http.delete(
      `${environment.api}/batches/batch/${batchId}/student/${userId}`
    );
  }

  getUsersBatches(userId: string) {
    return this.http.get(`${environment.api}/batches/user/${userId}/batches`);
  }

}
