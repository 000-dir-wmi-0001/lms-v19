import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import * as XLSX from 'xlsx';
import { AbstractControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Place, PlacementsService } from '../../services/placements.service';
import { StorageService } from '../../services/storage.service';
import Swal from 'sweetalert2';
import { NgxPhotoEditorService, Options } from 'ngx-photo-editor';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

interface PhotoEditorOptions {
  aspectRatio: number;
  autoCropArea: number;
  resizeToWidth: number;
  resizeToHeight: number;
  viewMode: number;
}
@Component({
  selector: 'app-placements',
  imports: [CommonModule, NgxPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl: './placements.component.html',
  styleUrl: './placements.component.css'
})
export class PlacementsComponent implements OnInit {
  placeForm: UntypedFormGroup = new UntypedFormGroup({
    Name: new UntypedFormControl(''),
    company: new UntypedFormControl(''),
    package: new UntypedFormControl(''),
  });

  p: number = 1;
  allFilesInfo: any = [];
  submitted = false;
  modalRef!: BsModalRef;
  showForm = false;
  placeRecords: any = [];
  visibleRecords: any[] = [];
  file: any;
  searchText!: string;
  fileName: string = 'PlacementExcelSheetLinkcodeLMS.xlsx';
  url = '';
  newRec = '';
  isLoading = false;
  selectedRecord: Place = { Name: '', Company: '', Package: 0, File: new File([], '') };
  previewUrl: string | null = null;

  constructor(private FormBuilder: UntypedFormBuilder, private http: HttpClient, private modalService: BsModalService, private router: Router, private placeService: PlacementsService, private storageService: StorageService, private photoEditor: NgxPhotoEditorService) { }

  ngOnInit() {
    this.placeForm = this.FormBuilder.group({
      Name: ['', [Validators.required]],
      company: ['', [Validators.required]],
      package: ['', [Validators.required]],
      file: ['', [Validators.required]],
    });

    this.placeService.getPlace().subscribe({
      next: (res: any) => {
        this.placeRecords = res.sort((a: any, b: any) => b.Package - a.Package);
      },
      error: (error: any) => {
        alert(error);
      }
    });
  }


  processFile(event: any) {
    const files: FileList = event.target.files;
    const file = files[0];

    if (file) {
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          customClass: { popup: 'swal-wide' },
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'file size exceeded',
        });
        event.target.value = '';
        return;
      }

      // Define photo editor options using the Options type
      const options: Options = {
        aspectRatio: 1,
        autoCropArea: 1,
        resizeToWidth: 800,
        resizeToHeight: 800,
        viewMode: 1 as any,
      };

      this.photoEditor.open(file, options).subscribe({
        next: (result: any) => {
          if (result && result.base64) {
            // Create new file from the output
            const base64String = result.base64 as string;
            const blob = this.dataURItoBlob(base64String);
            this.file = new File([blob], file.name, {
              type: file.type
            });

            // Create preview URL
            if (this.previewUrl) {
              URL.revokeObjectURL(this.previewUrl);
            }
            this.previewUrl = URL.createObjectURL(blob);
          }
        },
        error: (error) => {
          console.error('Error cropping image:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to process image. Please try again.',
            customClass: { popup: 'swal-wide' },
          });
        }
      });
    }
  }

  // Helper function to convert base64 to Blob
  private dataURItoBlob(dataURI: string): Blob {
    const base64String = dataURI.includes('base64,') ?
      dataURI.split('base64,')[1] :
      dataURI;

    try {
      const byteString = atob(base64String);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uint8Array = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i);
      }

      return new Blob([arrayBuffer], { type: 'image/jpeg' });
    } catch (error) {
      console.error('Error converting base64 to blob:', error);
      return new Blob([], { type: 'image/jpeg' });
    }
  }

  get formControls(): { [key: string]: AbstractControl } {
    return this.placeForm.controls;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  // Update place method
  updatePlace() {
    if (this.file) {
      this.selectedRecord.File = this.file;
    }

    this.placeService.updatePlace(`addPlacement/${this.selectedRecord._id}`, this.selectedRecord).subscribe({
      next: (res: any) => {
        if (this.file) {
          const url = JSON.stringify(this.selectedRecord.File);
          this.http.put(url, this.selectedRecord.File).subscribe({
            next: () => {
              this.successMsg();
              this.closeEditModal();
              this.ngOnInit();
            },
            error: () => {
              console.log('got url but error uploading file');
              this.errorMsg();
            }
          });
        } else {
          this.successMsg();
          this.closeEditModal();
          this.ngOnInit();
        }
      },
      error: () => {
        Swal.fire({
          title: "Some error!",
          text: "Enter valid data!",
          icon: "error"
        });
        this.closeEditModal();
      }
    });
  }

  // Update the openEditModal to handle image preview
  openEditModal(place: Place) {
    this.selectedRecord = { ...place };
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.style.display = 'block';
    }
  }

  // Clean up the preview URL when component is destroyed
  ngOnDestroy() {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
    }
  }


  closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.style.display = 'none';
    }
  }


  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }
  cancel(): void {
    this.modalRef.hide();
  }
  onDelete(id: any) {
    this.placeService.deletePlace(id).subscribe({
      next: (res: any) => {
        Swal.fire({
          title: "Good job!",
          text: "You deleted a record!",
          icon: "success"
        });
        this.modalRef.hide();
        this.placeRecords = this.placeRecords.filter(
          (file: { [x: string]: any }) => file['_id'] != id
        );
      },
      error: (error: any) => {
        console.log(error);
      }
    });
  }
  public uploadFileToS3() {
    //only text/coding files should be allowed
    this.submitted = true;
    if (this.placeForm.invalid) {
      return;
    }

    this.placeService.getUploadURL(this.placeForm.value)
      .subscribe(
        (res: any) => {
          this.url = res.url;
          this.newRec = res.newRec;
          console.log('url: ', this.url);
          console.log(this.newRec);
          if (this.url) {
            this.http.put(this.url, this.file).subscribe(
              (res: any) => {
                this.submitted = false;
                this.successMsg();
                console.log('Success');
                this.ngOnInit();
              },
              (error) => {
                console.log('got url but error uploading file');
                this.errorMsg();
              }
            );
          } else {
            console.log("didn't get url");
            this.errorMsg();
          }
        },
        (error) => {
          console.log('error in getting url');
          this.errorMsg();
        }
      );
  }

  errorMsg() {
    Swal.fire({
      icon: 'error',
      title: 'Error while uploading file',
      text: 'An error occurred while processing. Please try again later.',
      customClass: { popup: 'swal-wide' },
    });
  }
  successMsg() {
    Swal.fire({
      icon: 'success',
      title: 'File uploaded Successfully',
      text: 'The File has been uploaded successfully.',
      customClass: { popup: 'swal-wide' },
    });
  }

  searchRecords() {
    if (!this.searchText) {
      this.placeService.getPlace().subscribe(
        (result: any) => {
          this.placeRecords = result; // Set the initial data
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.placeService.getPlace().subscribe(
        (result: any) => {
          this.placeRecords = result.filter((record: any) => {
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
        for (let j = 0; j < rows[i].cells.length - 1; j++) {
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
