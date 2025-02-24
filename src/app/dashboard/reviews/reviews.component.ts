import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { CommonModule, JsonPipe } from '@angular/common';
import {
  FormControl,
  UntypedFormGroup,
  Validators,
  UntypedFormBuilder,
  AbstractControl,
  ReactiveFormsModule,
  FormsModule
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import Swal from 'sweetalert2';
import { Review, ReviewService } from '../../services/review.service'; 
import { NgxPaginationModule} from 'ngx-pagination';
@Component({
  selector: 'app-reviews',
  imports: [CommonModule , ReactiveFormsModule , FormsModule , NgxPaginationModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnInit {
  p: number = 1;
  reviewForm: UntypedFormGroup;
  revRecords:any = [];
  showForm = false;
  modalRef!: BsModalRef;
  searchText!: string;
  submitted = false;
  isLoading = false;
  selectedReview: Review = { Name: '', Company: '', Package: 0, Review: ''};
  fileName: string = 'ReviewExcelSheetLinkcodeLMS.xlsx';

  constructor(private FormBuilder: UntypedFormBuilder, private http: HttpClient, private modalService: BsModalService, private reviewService: ReviewService) {
    this.reviewForm = this.FormBuilder.group({
      Name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      package: ['', [Validators.required]],
      review: ['', [Validators.required]],
    });
  }

  async ngOnInit(){
    await this.reviewService.getReview().subscribe({
      next: (res:any) => {
        this.revRecords = res.sort((a:any, b:any) => b.Package - a.Package);
      },
      error: (error:any) => {
        alert(error);
      }
    });
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.reviewForm.controls;
  }
  toggleForm(){
    this.showForm = !this.showForm;
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.reviewForm.invalid) {
    return;
    }
    this.reviewService.addReview(this.reviewForm.value).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: "Good job!",
          text: "You added a record!",
          icon: "success"
        });
        this.submitted = false;
        this.reviewForm.reset();
        this.ngOnInit();
      },
      error: (error: any) => {
        alert(error);
      }
    });
  }

  openEditModal(review: Review) {
    this.selectedReview = { ...review };
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.style.display = 'block';
    }
  }

  closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.style.display = 'none';
    }
  }

  updateReview() {
    this.reviewService.updateReview(`addReview/${this.selectedReview._id}`, this.selectedReview).subscribe({
      next: (res:any) => {
        Swal.fire({
          title: "Good job!",
          text: "You Updated a record!",
          icon: "success"
        });
        this.closeEditModal();
        this.ngOnInit();
      },
      error: (error:any) => {
        Swal.fire({
          title: "Some error!",
          text: "Enter valid data!",
          icon: "error"
        });
        this.closeEditModal();
      }
    });
  
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  cancel(): void {
    this.modalRef.hide();
  }
  onDelete(id:any){
      this.reviewService.deleteReview(id).subscribe({
        next: (res:any) => {
          Swal.fire({
            title: "Good job!",
            text: "You deleted a record!",
            icon: "success"
          });
          this.modalRef.hide();
          this.revRecords = this.revRecords.filter(
            (file: { [x: string]: any }) => file['_id'] != id
          );
        },
        error: (error:any) => {
          console.log(error);
        }
      });
  }

  searchRecords() {
    if (!this.searchText) {
      this.reviewService.getReview().subscribe(
        (result: any) => {
          this.revRecords = result; // Set the initial data
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.reviewService.getReview().subscribe(
        (result: any) => {
          this.revRecords = result.filter((record: any) => {
            const Name = record.Name ? record.Name.toLowerCase() : '';
            const company = record.Company ? record.Company.toLowerCase() : '';
            return (
              Name.includes(this.searchText.toLowerCase()) || company.includes(this.searchText.toLowerCase())
            );
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

  export() {
    let table = document.getElementById('excel-table') as HTMLTableElement;
    if (table) {
      let rows = table.rows;

      let data = [];
      for (let i = 0; i < rows.length; i++) {
        let row = [];
        for (let j = 0; j < rows[i].cells.length-1; j++) {
          row.push(rows[i].cells[j].innerHTML);
        }
        data.push(row);
      }

      const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      XLSX.writeFile(wb, this.fileName);
    } else {
      console.error("Table not found");
    }
  }

}
