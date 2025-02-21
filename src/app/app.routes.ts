import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { HomepageComponent } from './auth/homepage/homepage.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoggedInAuthGuard } from './guards/logged-in-auth.guard';
import { AboutUsComponent } from './auth/about-us/about-us.component';
import { ContactComponent } from './auth/contact/contact.component';
import { LandingPageComponent } from './auth/landing-page/landing-page.component';
import { ForgotPassComponent } from './auth/forgot-pass/forgot-pass.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './auth/landing/landing.component';
import { GalleryComponent } from './auth/gallery/gallery.component';
import { PlacementComponent } from './auth/placement/placement.component';
import { ReviewComponent } from './auth/review/review.component';

export const routes: Routes = [
  {
    path: 'auth', component: AuthComponent, children: [

      { 
        path: '', redirectTo: 'main', pathMatch: 'prefix'
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
      },
      { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard] },
      { path: 'homepage', component: HomepageComponent },
      { path: "register", component: RegisterComponent, canActivate: [LoggedInAuthGuard] },
      { path: 'password_reset', component: ForgotPassComponent },      
   
      

    ]
  },
  {path:'dashboard', component:DashboardComponent,children:[
    
  ]
},
]
