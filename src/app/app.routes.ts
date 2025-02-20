import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { HomepageComponent } from './auth/homepage/homepage.component';
import { AboutUsComponent } from './auth/about-us/about-us.component';
import { ContactComponent } from './auth/contact/contact.component';
import { LandingPageComponent } from './auth/landing-page/landing-page.component';

export const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [
      { 
        path: '', redirectTo: 'main', pathMatch: 'prefix'
      }
      ,
      {
        path: 'login', component: LoginComponent
      }
      ,
      {
        path: 'homepage', component: HomepageComponent
      }
      ,
      {
        path: 'aboutUs', component: AboutUsComponent
      }
      ,
      {
        path: 'contact', component: ContactComponent
      }
      ,
      {
        path: 'main', component: LandingPageComponent
      }
    ]
  },
]
