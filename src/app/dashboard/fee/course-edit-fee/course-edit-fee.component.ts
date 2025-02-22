import { Component, OnInit } from '@angular/core';
import { FeeService } from '../../../services/fee.service'; 
import { StorageService } from '../../../services/storage.service';
import Swal from 'sweetalert2';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-course-edit-fee',
  imports: [RouterLink, CommonModule, ReactiveFormsModule ,FormsModule, RouterModule],
  templateUrl: './course-edit-fee.component.html',
  styleUrl: './course-edit-fee.component.css'
})
export class CourseEditFeeComponent implements OnInit {

  constructor(  private storageService:StorageService,private feeService:FeeService) { }
  isEdit=false;
  coursesList!:any;
  isLoading=true;
  editIndex: number | null = null;
 
  ngOnInit(): void {
    this.getAllCourses();
  }

  public getRole(){
    return this.storageService.getRole();
  }
  
  getAllCourses(){
    this.feeService.getALlStaticCourses().subscribe(
      (data)=>{
        this.coursesList=data;
      },
      (error)=>{
        console.log('error while fetching courses',error)
      }
    )
  }
  
  setEdit(i:any){
    this.editIndex = i;
    this.isEdit=true;
     
  }
  cancelEdit(){
    this.editIndex = null;
    this.isEdit=false;
  }
  editCoursePrice(id:any,newPrice:any){
    this.editIndex = null;
    
   if(newPrice>0){
    const courseToUpdate = this.coursesList.find((course:any) => course._id === id);
  
    if (courseToUpdate) {
      this.feeService.editStaticCoursePrice(id,newPrice).subscribe(
        (data)=>{          
          this.Toaster('success','Price Edited')
          this.getAllCourses()
        },
        (error)=>{
          console.log('error while fetching courses',error)
        }
      )
    } 
   }else{
    this.Toaster('error','badinput')
   }
  }

   Toaster(iconMsg:any,givenMsg:any){
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,

      timer: 2000,
      timerProgressBar: true,
      customClass: {popup : 'swal-wide'},
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: iconMsg,
      title: givenMsg,
    });
  }
}
