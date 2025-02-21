import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentNotificationService {
  getAllNotifications(userId: any): Observable<any> {
    return of({ Notifications: [] }); // Returns an empty observable
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class StudentNotificationService {
//   getAllNotifications(_userId: any) {
//     throw new Error('Method not implemented.');
//   }

//   constructor() { }
// }
