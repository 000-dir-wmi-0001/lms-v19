import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FeeService } from '../../../services/fee.service';
import {
  toSvg,
  toCanvas,
  toPixelData,
  toPng,
  toJpeg,
  toBlob,
  getFontEmbedCSS
} from 'html-to-image';

import jspdf, {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReceiptService } from '../../../services/receipt.service';
import { CommonModule } from '@angular/common';
// import { data } from 'jquery';

@Component({
  selector: 'app-print-receipt',
  imports: [CommonModule, RouterLink],
  templateUrl: './print-receipt.component.html',
  styleUrl: './print-receipt.component.css'
})
export class PrintReceiptComponent implements OnInit {
  @ViewChild('contentToConvert') contentToConvert!: ElementRef;
  receiptEntries:any = {};
  constructor(private activatedRoute:ActivatedRoute, private feeService: FeeService, private router: Router,private receiptService: ReceiptService) { }
  formEntries:any = {}
 
  ngOnInit() {
    this.formEntries = history.state;

    this.receiptEntries = {
      userId:this.formEntries.userId,
      receiptId:this.formEntries.receiptId,
      module:this.formEntries.module,
      thisInstallmentAmount:this.formEntries.thisInstallmentAmount,
      paymentMode:this.formEntries.paymentMode,
      installment:this.formEntries.installment,
      transactionId:this.formEntries.transactionId,
      paymentDate:this.formEntries.paymentDate,
      feeComplete:this.formEntries.feeComplete,
      isVerified:this.formEntries.isVerified
    }
  }

  public captureScreen() {
      const filename = 'receipt.pdf';
      const node = this.contentToConvert.nativeElement;

      toPng(node)
        .then( (dataUrl) => {
          const img = new Image();
          img.src = dataUrl;
          const pdf = new jspdf('p', 'mm', 'a4');
          pdf.setLineWidth(1);
          pdf.addImage(img, 'PNG', 0, 0, 210, 200);
          pdf.save(filename);
          this.receiptService.setReceiptEntries(this.receiptEntries).subscribe({
            next:(data:any) => {
              console.log("data",data);
              this.receiptService.postUserModules(this.formEntries.userId).subscribe({
                next: (data:any) => {
                  console.log(data,"receipt added in user module")
                },
                error: (err:any) => {
                  console.log(err,"Could not add receipt to the module")
                }
              })
            },
            error:(err)=>{
              console.log(err,"error");
            }
          })
          
        })
        .catch((error) => {
          console.error('oops, something went wrong!', error);
        });
    }


}

// userId:req.body.userId,
//             receiptId:req.body.regId,
//             module:req.body.module,
//             thisInstallmentAmount:req.body.amount,
//             installment:req.body.paymentMode,
//             transactionId:req.body.transactionId,
//             installment:req.body.installment,
//             paymentDate:req.body.paymentDate,
//             feeComplete:req.body.feeComplete,
//             isVerified:req.body.isVerified