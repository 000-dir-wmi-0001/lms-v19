import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';
import { StorageService } from '../../../services/storage.service'; 
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-certificate-form',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './certificate-form.component.html',
  styleUrl: './certificate-form.component.css'
})
export class CertificateFormComponent implements OnInit {


  form: UntypedFormGroup = new UntypedFormGroup({
    Name:new UntypedFormControl(''),
    Mobile:new UntypedFormControl(''),
    Email: new UntypedFormControl(''),
    Course:new UntypedFormControl(''),
    CourseStart:new UntypedFormControl(''),
    CourseEnd:new UntypedFormControl(''),
    BatchCode:new UntypedFormControl('')
  })
  userId!:any;
  token:any;
  selectedRecord:boolean=false;
  isLoading: boolean = false;
  submitted=false;
  constructor(private formBuilder: UntypedFormBuilder,private certService:CertificateService,private storageService:StorageService,private router:Router) { }

  ngOnInit(): void {
    console.log("loaded")
    this.token=this.storageService.getToken();
    this.userId=JSON.parse(atob(this.token.split('.')[1]))._id
  this.isLoading=false;
  this.form = this.formBuilder.group(
    {
      Name: ['', [Validators.required]],
      Mobile: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      Course:['',Validators.required],
      CourseStart: ['', [Validators.required]],      
      CourseEnd: ['', [Validators.required]],
      BatchCode: ['', [Validators.required]]
    },
    { validators: this.dateRangeValidator('CourseStart', 'CourseEnd') }
  )
  }
  dateRangeValidator(startKey: string, endKey: string) {
    return (group: UntypedFormGroup): { [key: string]: any } | null => {
      const start = group.get(startKey)?.value;
      const end = group.get(endKey)?.value;

      if (start && end && new Date(start) > new Date(end)) {
        return { dateRangeError: true };
      }

      return null;
    };
  }
  public getRole() {
    return this.storageService.getRole();
  }

  addEntry(){
    if(this.form.valid){
     let data={
        "userId":this.userId,
        "name": this.form.value.Name,
        "mobile":this.form.value.Mobile,
        "email":this.form.value.Email,
        "course":this.form.value.Course,
        "courseStartDate":this.form.value.CourseStart,
        "courseEndDate":this.form.value.CourseEnd,
        "batchCode":this.form.value.BatchCode
      }
      this.certService.createCertRequest(data).subscribe(
        (result:any)=>{
          console.log(result.message)
          this.router.navigate(['/dashboard/certificate'])
        },
        (error:any)=>{
          console.log(error)
        }
      )
      }   
  }
}
