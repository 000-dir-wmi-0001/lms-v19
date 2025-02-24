import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
// import { HomepageComponent } from './auth/homepage/homepage.component';
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
import { ResetPasswordComponent } from './auth/resetpassword/resetpassword.component';
import { PosComponent } from './pos/pos.component';
import { AuthGuard } from './guards/auth.guard';
import { CourseInfoComponent } from './course-info/course-info.component';
import { ListBatchComponent } from './dashboard/batch/list-batch/list-batch.component';
import { BatchDetailsComponent } from './dashboard/batch/batch-details/batch-details.component';
import { LandingComponent } from './auth/landing/landing.component';
import { ExamComponent } from './dashboard/exam/exam.component';
import { FeeComponent } from './dashboard/fee/fee.component';
import { UserComponent } from './dashboard/user/user.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { TaskComponent } from './dashboard/task/task.component';
import { AddTaskComponent } from './dashboard/add-task/add-task.component';
import { UpdateTaskComponent } from './dashboard/update-task/update-task.component';
import { CompilerComponent } from './dashboard/compiler/compiler/compiler.component';
import { GetEnquiryComponent } from './dashboard/get-enquiry/get-enquiry.component';
import { CertificateComponent } from './dashboard/certificate/certificate.component';
import { AdmissionComponent } from './dashboard/admission/admission.component';
import { StudDashboardComponent } from './dashboard/stud-dashboard/stud-dashboard.component';
import { AlumniListComponent } from './auth/alumni/alumni-list/alumni-list.component';
import { AdminDailynoticeComponent } from './dashboard/admin-dailynotice/admin-dailynotice.component';
import { BatchComponent } from './dashboard/batch/batch/batch.component';
import { LiveClassComponent } from './dashboard/live-class/live-class.component';
import { AddCodingQuestionComponent } from './dashboard/compiler/add-coding-question/add-coding-question.component';
import { ExamDetailStudentComponent } from './dashboard/compiler/exam-detail-student/exam-detail-student.component';
import { AddExamComponent } from './dashboard/exam/add-exam/add-exam.component';
import { AddLlmQuestionComponent } from './dashboard/exam/add-llm-question/add-llm-question.component';
import { AddQuestionComponent } from './dashboard/exam/add-question/add-question.component';
import { AttemptVerbalComponent } from './dashboard/exam/attempt-verbal/attempt-verbal.component';
import { CheckStudentVerbalResultComponent } from './dashboard/exam/check-student-verbal-result/check-student-verbal-result.component';
import { CheckVerbalResultComponent } from './dashboard/exam/check-verbal-result/check-verbal-result.component';
import { DisplayResultComponent } from './dashboard/exam/display-result/display-result.component';
import { ExamAttemptComponent } from './dashboard/exam/exam-attempt/exam-attempt.component';
import { ExamDetailComponent } from './dashboard/exam/exam-detail/exam-detail.component';
import { ListExamComponent } from './dashboard/exam/list-exam/list-exam.component';
import { StudentExamComponent } from './dashboard/exam/student-exam/student-exam.component';
import { UpdateExamComponent } from './dashboard/exam/update-exam/update-exam.component';
import { AddCourseComponent } from './dashboard/course/instructor/add-course/add-course.component';
import { AddLectureComponent } from './dashboard/course/instructor/add-lecture/add-lecture.component';
import { CourseListComponent } from './dashboard/course/instructor/course-list/course-list.component';
import { UpdateCourseComponent } from './dashboard/course/instructor/update-course/update-course.component';
import { UpdateLectureComponent } from './dashboard/course/instructor/update-lecture/update-lecture.component';
import { ViewCourseComponent } from './dashboard/course/instructor/view-course/view-course.component';
import { ViewLecComponent } from './dashboard/course/instructor/view-lec/view-lec.component';
import { MyLearningsComponent } from './dashboard/course/student/my-learnings/my-learnings.component';
import { AddFeeComponent } from './dashboard/fee/add-fee/add-fee.component';
import { AddStaticCourseComponent } from './dashboard/fee/add-static-course/add-static-course.component';
import { CourseEditFeeComponent } from './dashboard/fee/course-edit-fee/course-edit-fee.component';
import { DisplayStudentInfoComponent } from './dashboard/fee/display-student-info/display-student-info.component';
import { EditFeeComponent } from './dashboard/fee/edit-fee/edit-fee.component';
import { FeeReceiptComponent } from './dashboard/fee/fee-receipt/fee-receipt.component';
import { PrintReceiptComponent } from './dashboard/fee/print-receipt/print-receipt.component';
import { FeeListComponent } from './dashboard/fee/student-fee-list/student-fee-list.component';
import { AddUserComponent } from './dashboard/user/add-user/add-user.component';
import { UserListComponent } from './dashboard/user/user-list/user-list.component';
import { AttemptCodingExamComponent } from './dashboard/compiler/attempt-coding-exam/attempt-coding-exam.component';
import { ListCodeComponent } from './dashboard/code-sharing/list-code/list-code.component';
import { UploadFileComponent } from './dashboard/code-sharing/upload-file/upload-file.component';
import { ViewCodeComponent } from './dashboard/code-sharing/view-code/view-code.component';
import { CertificateApproveComponent } from './dashboard/certificate/certificate-approve/certificate-approve.component';
import { CertificateFormComponent } from './dashboard/certificate/certificate-form/certificate-form.component';
import { CertificateRequestComponent } from './dashboard/certificate/certificate-request/certificate-request.component';
import { JoinMeetComponent } from './dashboard/batch/join-meet/join-meet.component';
import { MeetingsComponent } from './dashboard/batch/meetings/meetings.component';
import { StartMeetComponent } from './dashboard/batch/start-meet/start-meet.component';
import { StudMeetComponent } from './dashboard/batch/stud-meet/stud-meet.component';
import { UserBatchComponent } from './dashboard/batch/user-batch/user-batch.component';
import { JoinMeetingComponent } from './dashboard/live-class/join-meeting/join-meeting.component';
import { MeetingComponent } from './dashboard/live-class/meeting/meeting.component';
import { StartMeetingComponent } from './dashboard/live-class/start-meeting/start-meeting.component';
import { StudMeetingComponent } from './dashboard/live-class/stud-meeting/stud-meeting.component';
import { ModuleComponent } from './dashboard/module/module.component';
import { StudDailynoticeComponent } from './dashboard/stud-dailynotice/stud-dailynotice.component';
import { IsSuperAdminOrAdminGuard } from './guards/is-admin.guard';
import { RegisterStudentComponent } from './pos/register-student/register-student.component';
import { CodeSharingComponent } from './dashboard/code-sharing/code-sharing.component';

export const routes: Routes = [

  //Auth Components routes
  { path: '', redirectTo: 'auth', pathMatch: 'prefix' },
  {
    path: 'auth', component: AuthComponent, children: [
      { path: '', redirectTo: 'main', pathMatch: 'prefix' },
      { path: 'main', component: LandingPageComponent, canActivate: [LoggedInAuthGuard] },
      { path: "homepage", component: LandingComponent, canActivate: [LoggedInAuthGuard] },
      // { path: 'homepage', component: HomepageComponent },
      { path: 'login', component: LoginComponent, canActivate: [LoggedInAuthGuard] },
      { path: "register", component: RegisterComponent, canActivate: [LoggedInAuthGuard] },
      { path: 'password_reset', component: ForgotPassComponent },
      { path: 'password_reset/:resetToken', component: ResetPasswordComponent },
      // { path: 'dashboard/cart', component: CartComponent, canActivate: [AuthGuard] },
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
        path: 'exam', component: ExamComponent, children: [
          { path: 'verbalResult/:id/:studentid', component: CheckStudentVerbalResultComponent },
          { path: 'update-question/:qid/:eid/:type', component: UpdateExamComponent },
          { path: 'display-marks/:studId/:examId/:resultId', component: DisplayResultComponent },
          { path: '', component: ListExamComponent },
          { path: 'add', component: AddExamComponent },
          { path: 'verbal/attempt-exam/:id', component: AttemptVerbalComponent },
          { path: 'add-question/:id/:Examtype/:addManual', component: AddQuestionComponent },
          { path: 'compiler/attempt-exam/:id', component: ExamDetailStudentComponent },
          { path: ':id/:type/attempt', component: ExamAttemptComponent },
          { path: ':id/:ExamType/:str', component: ExamDetailComponent },
          { path: 'compiler/add-question/:id/:ExamType', component: AddCodingQuestionComponent },
          { path: 'verbalResult/:id', component: CheckVerbalResultComponent },
          { path: 'student', component: StudentExamComponent },
          { path: 'addllm-question/:examId', component: AddLlmQuestionComponent }
        ]
      },
      // dashboard/course/Car
      // auth/dashboard/cart
      {
        path: 'course', component: CourseComponent, children:
          [
            { path: "add", component: AddCourseComponent },
            { path: "", component: CourseListComponent },
            { path: "cart", component: CartComponent },
            { path: "my-learning", component: MyLearningsComponent },
            { path: ":courseId/update", component: UpdateCourseComponent },
            { path: ":courseId", component: ViewCourseComponent },
            { path: ":courseId/add", component: AddLectureComponent },
            { path: ":courseId/:lectureId/update", component: UpdateLectureComponent },
            { path: ":courseId/:lectureId/:fileName/:thumbnail", component: ViewLecComponent }

          ]
      },

      {
        path: 'fee', component: FeeComponent, children:
          [
            { path: '', component: FeeListComponent },
            { path: 'add-fee', component: AddFeeComponent },
            { path: 'displayStudentInfo/:id', component: DisplayStudentInfoComponent },
            { path: 'edit/:id', component: EditFeeComponent },
            // { path: 'editCourseFee', component: CourseEditFeeComponent },
            { path: 'fee-receipt', component: FeeReceiptComponent },
            { path: 'print-receipt', component: PrintReceiptComponent },
            { path: 'addStaticCourse', component: AddStaticCourseComponent }


          ]
      },
      {
        path: 'module', component: ModuleComponent, children: [
          { path: 'editCourseFee', component: CourseEditFeeComponent },

        ]
      },

      {
        path: 'user', component: UserComponent, children:
          [
            { path: "add", component: AddUserComponent },
            { path: "", component: UserListComponent }
          ]

      },

      { path: 'profile', component: ProfileComponent },

      { path: 'task', component: TaskComponent },

      { path: 'task/create', component: AddTaskComponent },

      { path: 'task/:id', component: UpdateTaskComponent },

      {
        path: 'compiler', component: CompilerComponent, children:
          [
            { path: 'add-question/:id/:ExamType', component: AddCodingQuestionComponent },
            { path: 'attempt/:id', component: AttemptCodingExamComponent },
            { path: 'attempt-exam/:id', component: ExamDetailStudentComponent },

          ]
      },

      // {
      //   path: 'auth', component: AuthComponent, children:
      //     [

      //     ]

      // },
      { path: 'get-enquiry', component: GetEnquiryComponent },
      {
        path: 'code-sharing', component: CodeSharingComponent, children:
          [
            { path: '', component: ListCodeComponent },
            { path: ':fileId/:fileName/:thumbnail', component: ViewCodeComponent },
            { path: 'upload', component: UploadFileComponent },

          ]
      },

      {
        path: 'certificate', component: CertificateComponent, children:
          [
            { path: '', component: CertificateRequestComponent },
            { path: 'certApprove/:id', component: CertificateApproveComponent },
            { path: 'certForm', component: CertificateFormComponent }

          ]
      },

      { path: 'admission', component: AdmissionComponent },
      { path: 'addAdmission', component: AdmissionComponent },
      { path: '', component: StudDashboardComponent },
      { path: 'alumni-list', component: AlumniListComponent },
      { path: 'Placements', component: PlacementComponent },
      { path: 'Review', component: ReviewComponent },
      { path: 'admin-dailynotice', component: AdminDailynoticeComponent },
      { path: 'student-dailynotice', component: StudDailynoticeComponent },
      {
        path: 'batch', component: BatchComponent, children:
          [
            { path: '', component: BatchComponent },
            { path: 'details/:id', component: BatchDetailsComponent },
            { path: 'meet/:id', component: MeetingsComponent },
            { path: 'start-meeting/:meetId/:pwd', component: StartMeetComponent },
            { path: 'userbatches', component: UserBatchComponent },
            { path: 'userbatches/stud/:id', component: StudMeetComponent },
            { path: 'join-meeting', component: JoinMeetComponent }

          ]
      },
      {
        path: 'live-class', component: LiveClassComponent, children:
          [
            { path: 'host', component: MeetingComponent },
            { path: 'join-meeting', component: JoinMeetingComponent },
            { path: 'start-meeting', component: StartMeetingComponent },
            { path: 'stud', component: StudMeetingComponent }
          ]
      }
    ]
  },


  //Pos Components routes
  {
    path: 'pos', component: PosComponent, children: [
      {
        path: '',
        redirectTo: 'register',
        pathMatch: 'full',
      },
      {
        path: 'register',
        component: RegisterStudentComponent,
        canActivate: [IsSuperAdminOrAdminGuard],
      }
    ], canActivate: [AuthGuard]
  },



  //CourseInfo Components routes
  { path: 'courseInfo', component: CourseInfoComponent },

  //Dashboard Batch component
  { path: 'dashboard/batch', component: ListBatchComponent },


  { path: 'dashboard/batch/details/:name', component: BatchDetailsComponent }
]
