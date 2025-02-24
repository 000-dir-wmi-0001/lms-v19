import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Batch } from './batch.service'; // Adjust the path accordingly

@Injectable({
  providedIn: 'root'
})
export class BatchStateService {
  private batchesSource = new BehaviorSubject<Batch[]>([]);
  batches$ = this.batchesSource.asObservable();

  // Method to update batches
  updateBatches(batches: Batch[]) {
    this.batchesSource.next(batches);
  }
  // Method to add a new batch at the beginning of the list
  addBatch(batch: Batch) {
    const currentBatches = this.batchesSource.value;
    this.batchesSource.next([batch, ...currentBatches]);
  }

}
