
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeeService {
  getFeesStud(userId: any): Observable<any> {
    return of([{ pendingFee: 0 }]); // Returns a mock observable
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class FeeService {
//   getFeesStud(_userId: any) {
//     throw new Error('Method not implemented.');
//   }

//   constructor() { }
// }
