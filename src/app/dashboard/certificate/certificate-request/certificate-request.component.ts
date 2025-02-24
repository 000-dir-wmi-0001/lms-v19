import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';
import { StorageService } from '../../../services/storage.service'; 
import * as XLSX from 'xlsx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-certificate-request',
  imports: [FormsModule, CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './certificate-request.component.html',
  styleUrl: './certificate-request.component.css'
})
export class CertificateRequestComponent implements OnInit {


  constructor(private CertService: CertificateService, private http: HttpClient, private storageService: StorageService, private router: Router) { }

  listTitles = [
    { name: 'index' },
    { name: 'StudentName' },
    { name: 'Email' },
    { name: 'Mobile' },
    { name: 'Course' },
    { name: 'StartDate' },
    { name: 'EndDate' },
    { name: "Batch Code" }
  ];
  requestALL!: any;
  request!: any;
  token!: any;
  userId!: any;
  name: any;
  selectedDate: Date | null = null;

  fileName = "LinkCodeCertificateData.xls"
  ngOnInit(): void {

    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id

    if (this.getRole() == 'STUDENT') {
      this.getSpecificCertRequest();
    } else {
      this.getAllCertRequest();
    }
  }
  filterByDate() {
    if (!this.selectedDate) {
      this.getAllCertRequest
    } else {
      this.request = this.requestALL.filter((request: any) => {
        return request.createdAt?.slice(0, 10) == this.selectedDate?.toString();
      });
    }
  }

  getAllCertRequest() {
    this.CertService.getRequest().subscribe(
      (result: any) => {
        this.requestALL = result
        this.request = this.requestALL;
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  getSpecificCertRequest() {
    this.CertService.getSpecificRequest(this.userId).subscribe(
      (result) => {
        this.request = result
      },
      (error) => {
        console.log(error)
      }
    )
  }
  public getRole() {
    return this.storageService.getRole();
  }
  handleDoubleClick(id: any) {
    this.router.navigate(['/dashboard/certificate/certApprove', id])
  }

  delete(userId: any, id: any) {
    this.CertService.deleteRequest(id).subscribe(
      (result) => {
        this.updateApproveStatus(userId,id)
        this.getAllCertRequest();
      },
      (error) => {
        console.log(error)
      }
    )
  }

  updateApproveStatus(userId:any,id:any){
    this.CertService.approveRequest(id, false).subscribe(
      (result: any) => {
        console.log(result)
        this.deletefromAws(userId,id);
      },
      (error: any) => {
        console.log(error)
      })
  }
  deletefromAws(userId:any,id:any){
    this.CertService.deleteCertFile(userId, id).subscribe(
      (result: any) => {
        console.log(result)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  downloadFromUrl(url: any) {
    this.http.get(url, { responseType: 'blob' }).subscribe((data: Blob) => {
      const blob = new Blob([data], { type: data.type });
      const anchor = document.createElement('a');
      anchor.download = 'LinkCodeCertificate' + this.userId;
      anchor.href = window.URL.createObjectURL(blob);
      anchor.click();
      window.URL.revokeObjectURL(anchor.href);
      anchor.remove();
    });
  }

  downloadCert(userId: any, certId: any) {
    this.CertService.getDownloadURLCerti(userId, certId).subscribe(
      (result) => {
        this.downloadFromUrl(result);
      },
      (error) => {
        console.log(error)
      }
    )
  }


  searchEntries() {
    if (!this.name) {
      this.getAllCertRequest();
    } else {
      this.request = this.request.filter((request: any) => {
        return request.Name?.toLowerCase().includes(this.name?.toLowerCase())
      }
      );
    }
  }
  export() {
    let data = document.getElementById("table-data");
    const clonedData = data?.cloneNode(true) as HTMLElement;
    const mobileColumnIndex = 3;
    const rows = clonedData.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      const mobileCell = cells[mobileColumnIndex];
      if (mobileCell) {
        mobileCell.textContent = "'" + mobileCell.textContent;
      }
    });

    const deleteButtonColumnIndex = 9;
    if (deleteButtonColumnIndex >= 0) {
      const deleteButtonCells = clonedData.querySelectorAll(`td:nth-child(${deleteButtonColumnIndex + 1})`);
      deleteButtonCells.forEach(button => {
        button.parentNode?.removeChild(button);
      });
    }
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(clonedData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
  }


}
