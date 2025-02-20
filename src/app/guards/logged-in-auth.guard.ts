import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedInAuthGuard implements CanActivate {

  constructor(private storageService: StorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.storageService.isLoggedIn()) {
      this.router.navigate(['/dashboard'])
      return false;
    }
    return true;
  }

}


// import { CanActivateFn } from '@angular/router';

// export const loggedInAuthGuard: CanActivateFn = (route, state) => {
//   return true;
// };
