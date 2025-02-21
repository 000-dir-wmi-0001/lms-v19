
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isSidebarExpanded = new BehaviorSubject<boolean>(true); // Default state: expanded
  isSidebarExpanded$ = this.isSidebarExpanded.asObservable();

  constructor() { }

  toggleSidebar() {
    this.isSidebarExpanded.next(!this.isSidebarExpanded.value);
  }

  setSidebarState(expanded: boolean) {
    this.isSidebarExpanded.next(expanded);
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class SidebarService {
//   isSidebarExpanded$: any;

//   constructor() { }
// }
