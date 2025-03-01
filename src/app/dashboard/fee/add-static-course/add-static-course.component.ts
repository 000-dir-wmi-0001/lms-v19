import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeeService } from '../../../services/fee.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { data } from 'jquery';

@Component({
  selector: 'app-add-static-course',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './add-static-course.component.html',
  styleUrl: './add-static-course.component.css'
})
export class AddStaticCourseComponent implements OnInit {

  Module: any;

  constructor(private feeService: FeeService, private formBuilder: UntypedFormBuilder, private router: Router, private userService: UserService) { }


  productForm: UntypedFormGroup = new UntypedFormGroup({
    name: new UntypedFormControl(''),
    price: new UntypedFormControl('')
  })
  ngOnInit(): void {
    this.productForm = this.formBuilder.group(
      {
        name: ['', [Validators.required]],
        price: ['', [Validators.required]]
      }
    )
  }
  onSubmit() {

    this.Module = this.productForm.value;
    console.log(this.Module)
    this.userService.addNewModule(this.Module).subscribe(
      (data) => {
        console.log("successfully added module");
        console.log(data);
        this.router.navigate(['/dashboard/module/'])
      },
      (error: any) => {
        console.log(error)
      }
    );

    // /addModulesfromAdmin/:id


    // this.feeService.createStaticCourse(this.productForm.value).subscribe(
    //   (data) => {
    //     this.router.navigate(['/dashboard/fee/editCourseFee'])
    //   },
    //   (error: any) => {
    //     console.log(error)
    //   }
    // )
  }

  onBack() {
    this.router.navigate(['dashboard/module/'])
  }

}
