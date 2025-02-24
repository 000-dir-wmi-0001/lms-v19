import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CertificateService } from '../../../services/certificate.service';
import { StorageService } from '../../../services/storage.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-certificate-approve',
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate-approve.component.html',
  styleUrl: './certificate-approve.component.css'
})
export class CertificateApproveComponent implements OnInit {
 
  selectedRecord!: any;
  userId!: any;
  certId!: any;
  token!: any;
  file!: any;
  constructor(private storageService: StorageService, private router:Router,private http: HttpClient, private CertService: CertificateService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.certId = params['id'];
    });
    this.getSpecificCertData();
  }

  
  getSpecificCertData(){
    this.CertService.getSpecificCert(this.certId).subscribe(
      (result: any) => {
        this.selectedRecord=result[0]
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  saveFile() {
    this.CertService.getUploadUrlCerti(this.selectedRecord.user._id, this.certId).subscribe(
      (result: any) => {
        this.uploadURL(result.url)
      },
      (error: any) => {
        console.log(error)
      })
  }

  uploadURL(url:any){
    this.http.put(url, this.file).subscribe(
      (result: any) => {
        this.updateStatus();
      },
      (error: any) => {
        console.log('error while puttinng', error)
      })
  }

  updateStatus(){
    this.CertService.approveRequest(this.certId, true).subscribe(
      (result: any) => {
        this.router.navigate(['/dashboard/certificate'])
      },
      (error: any) => {
        console.log(error)
      })
  }
  save(id: any) {
    this.certId = id;
    this.saveFile();   
  }

    onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

}
