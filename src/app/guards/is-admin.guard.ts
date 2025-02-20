import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';

import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class IsSuperAdminOrAdminOrInstructorGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.storageService.getRole() != 'SUPERADMIN' &&
      this.storageService.getRole() != 'ADMIN' &&
      this.storageService.getRole() != 'INSTRUCTOR'
    ) {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}

@Injectable({
  providedIn: 'root',
})
export class IsSuperAdminOrAdminGuard implements CanActivate {
  constructor(private storageService: StorageService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (
      this.storageService.getRole() != 'SUPERADMIN' &&
      this.storageService.getRole() != 'ADMIN'
    ) {
      console.log('first role');
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }
}


// import { CanActivateFn } from '@angular/router';

// export const isAdminGuard: CanActivateFn = (route, state) => {
//   return true;
// };
