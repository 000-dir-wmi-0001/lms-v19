import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { HomepageComponent } from './auth/homepage/homepage.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoggedInAuthGuard } from './guards/logged-in-auth.guard';

export const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [
      { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard] },
      { path: 'homepage', component: HomepageComponent },
      { path: "register", component: RegisterComponent, canActivate: [LoggedInAuthGuard] },

    ]
  },
]
