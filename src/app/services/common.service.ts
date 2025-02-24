import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Batch } from "./batch.service";


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  editBatch: BehaviorSubject<any>;
  updateBatch : BehaviorSubject<any>;
  viewBatch: BehaviorSubject<Batch | null>;
  constructor() {
      this.editBatch = new BehaviorSubject(null);
      this.updateBatch = new BehaviorSubject(false);
      this.viewBatch = new  BehaviorSubject<Batch | null>(null);
  }

  showError(message: string): void {
      console.error(message);
  }
}