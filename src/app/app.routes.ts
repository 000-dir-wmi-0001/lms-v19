import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
// import { HomepageComponent } from './auth/homepage/homepage.component';

export const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [
      {
        path: 'login', component: LoginComponent
      }
      // ,
      // {
      //   path: 'home', component: HomepageComponent
      // }
    ]
  }
  // { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.routes) },
]
