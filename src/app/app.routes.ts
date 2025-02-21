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
import { CourseComponent } from './dashboard/course/course.component';
import { CartComponent } from './dashboard/course/student/cart/cart.component';
import { AlumniRegisterComponent } from './auth/alumni/alumni-register/alumni-register.component';
import { CComponent } from './auth/courses/c/c.component';
import { CppComponent } from './auth/courses/cpp/cpp.component';
import { JavaComponent } from './auth/courses/java/java.component';
import { PythonComponent } from './auth/courses/python/python.component';
import { GalleryComponent } from './auth/gallery/gallery.component';
import { PlacementComponent } from './auth/placement/placement.component';
import { ReviewComponent } from './auth/review/review.component';
import { VerifyUserComponent } from './auth/verify-user/verify-user.component';
import { ResetpasswordComponent } from './auth/resetpassword/resetpassword.component';
import { PosComponent } from './pos/pos.component';
import { AuthGuard } from './guards/auth.guard';
import { CourseInfoComponent } from './course-info/course-info.component';
import { ListBatchComponent } from './dashboard/batch/list-batch/list-batch.component';
import { BatchDetailsComponent } from './dashboard/batch/batch-details/batch-details.component';

export const routes: Routes = [

  //Auth Components routes
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth', component: AuthComponent, children: [

      { path: '', redirectTo: 'main', pathMatch: 'prefix' },
      { path: 'aboutUs', component: AboutUsComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'main', component: LandingPageComponent },
      { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard] },
      { path: 'homepage', component: HomepageComponent },
      { path: "register", component: RegisterComponent, canActivate: [LoggedInAuthGuard] },
      { path: 'dashboard/cart', component: CartComponent },
      { path: 'password_reset/:resetToken', component: ResetpasswordComponent },
      { path: 'placement', component: PlacementComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: 'verifyUser/:token', component: VerifyUserComponent },
      { path: 'alumni', component: AlumniRegisterComponent },
      { path: 'review', component: ReviewComponent },

      { path: 'aboutUs', component: AboutUsComponent },

      { path: 'c', component: CComponent },
      { path: 'java', component: JavaComponent },
      { path: 'cpp', component: CppComponent },
      { path: 'python', component: PythonComponent },
      { path: 'courses', component: CourseComponent }

    ]
  },

  //Dashboard Components routes
  {
    path: 'dashboard', component: DashboardComponent, children: [
      {
        path: 'course', component: CourseComponent, children: [
          { path: 'cart', component: CartComponent },
        ]
      }
    ]
  },


  //Pos Components routes
  {
    path: 'pos', component: PosComponent, children: [

    ], canActivate: [AuthGuard]
  },



  //CourseInfo Components routes
  { path: 'courseInfo', component: CourseInfoComponent },

  //Dashboard Batch component
  { path: 'dashboard/batch', component: ListBatchComponent },


  { path: 'dashboard/batch/details/:name', component: BatchDetailsComponent }
]
