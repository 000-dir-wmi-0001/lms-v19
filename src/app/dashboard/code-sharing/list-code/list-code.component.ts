import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service'; 
import { CodesharingService } from '../../../services/codesharing.service'; 
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-list-code',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './list-code.component.html',
  styleUrl: './list-code.component.css'
})
export class ListCodeComponent implements OnInit {
  FileForm: UntypedFormGroup = new UntypedFormGroup({
    file: new UntypedFormControl(),
  });

  filteredfiles: any[] = [];
  @ViewChild('searchBox') searchInput!: ElementRef<HTMLInputElement>;
  files: any = [];
  allFilesInfo: any = [];
  submitted = false;
  file: any;
  fileDownloadurl = '';
  fileContent = '';
  filetype = '';
  isLoading = false;
  viewFileStatus = true;
  fileContentStatus = true;
  errMessage = '';
  copymessage = '';
  token: any;
  userId: any;
  modalRef!: BsModalRef;
  toolTip: boolean = false;

  constructor(
    private codesSharingService: CodesharingService,
    private storageService: StorageService,
    private http: HttpClient,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {
    this.token = this.storageService.getToken();
    this.userId = JSON.parse(atob(this.token.split('.')[1]))._id;
    this.isLoading = false;
    this.getAllFiles();
  }

  public getRole() {
    return this.storageService.getRole();
  }

  public getAllFiles() {
    this.codesSharingService.getAllFiles().subscribe({
      next: (data: any) => {
        this.isLoading = true;
        this.files = data.files;
        this.allFilesInfo = data.files;
      },
    });
    // console.log("Loading is yet to be Implemented..!!");
  }

  public timestamp(ts: string) {
    const timestamp: string = ts;
    const date: Date = new Date(timestamp);

    // Extract date components
    const year: number = date.getFullYear();
    const month: string = String(date.getMonth() + 1).padStart(2, '0'); // Month is zero-indexed
    const day: string = String(date.getDate()).padStart(2, '0');
    const hours: string = String(date.getHours()).padStart(2, '0');
    const minutes: string = String(date.getMinutes()).padStart(2, '0');

    // Format as a string in your desired format
    const formattedTimestamp: string = `${day}-${month}-${year} ${hours}:${minutes}`;

    return formattedTimestamp;
  }

  async openModal(
    template: TemplateRef<any>,
    fileId: string,
    fileUserId: string,
    filename: string
  ) {
    console.log('model called');
    try {
      await this.getDownloadUrl(fileId, fileUserId, filename);
      if (this.fileDownloadurl && this.viewFileStatus === true) {
        this.filetype = this.detectFileType(filename);
        if (this.filetype === 'text' || this.filetype === 'code') {
          this.fetchFileContent(this.fileDownloadurl);
          if (!this.fileContentStatus) {
            return;
          }
        } else if (this.filetype === 'image') {
          //image type files only
          this.fileContent = ''; // Clear content for non-text file types
        }
        //else if(){} //pdf, docs
        else {
          //unknown file types
          //directly download/ not direcly
          this.errMessage = 'File format unsupported!';
          this.displayErrMsg();
          return;
        }
        this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
        console.log('this.filetype', this.filetype);
      } else {
        //errrormsg
        return;
      }
    } catch (error) {
      this.errMessage = 'Something went wrong, Please try again later';
      this.displayErrMsg();
    }
  }

  detectFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    //console.log('fileName', fileName);
    // console.log('extension', extension);
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return 'image'; // Image files
      case 'txt':
        return 'text'; // Text files
      case 'zip':
        return 'zip';
      case 'cpp':
      case 'c':
      case 'h':
      case 'js':
      case 'ts':
      case 'py':
      case 'pyc':
      case 'html':
      case 'css':
      case 'java':
      case 'cs':
      case 'sh':
      case 'bat':
      case 'yml':
      case 'yaml':
      case 'json':
      case 'md':
      case 'sql':
      case 'r':
      case 'php':
      case 'swift':
      case 'rb':
      case 'db':
        return 'code'; // Code files
      case 'doc':
      case 'pdf':
      case 'docx':
        return 'doc'; // doc files
      // Add more cases for other file types as needed
      default:
        return 'unknown'; // Unknown file type
    }
  }

  fetchFileContent(downloadUrl: string): void {
    this.http.get(downloadUrl, { responseType: 'text' }).subscribe(
      (response: string) => {
        // handle fetched file content
        this.fileContent = response;
        this.fileContentStatus = true;
      },
      (error) => {
        console.error('Error fetching file content:', error);
        this.fileContentStatus = false;
        // Handle errors if needed
        //errMsg - something went wrong, error fetching file content
      }
    );
  }

  async getDownloadUrl(id: string, user: string, name: string): Promise<void> {
    this.fileDownloadurl = this.storageService.getDownloadUrlByFileId(id);

    if (this.fileDownloadurl === null) {
      //     console.log('url not founnd in localstorage');
      return new Promise<void>((resolve, reject) => {
        this.codesSharingService.getDownloadUrl(id, user, name).subscribe(
          (res: any) => {
            this.fileDownloadurl = res;
            console.log(this.fileDownloadurl);
            const defaultExpiration = new Date('2999-12-31T23:59:59.999Z'); // Set a far-future expiration date
            const urlExpireTime =
              this.getExpirationTimestamp(this.fileDownloadurl) ||
              defaultExpiration;
            this.storageService.addDownloadUrl(
              id,
              this.fileDownloadurl,
              urlExpireTime
            );
            console.log('got download url success: ', this.fileDownloadurl);
            this.viewFileStatus = true;
            resolve(); // Resolve the promise when the download URL is set
          },
          (error: any) => {
            console.log('Error getting Download Url: ', error);
            reject(error); // Reject the promise with the error
            //display error msg
            this.errMessage = 'Error while fetching file';
            this.displayErrMsg();
            this.viewFileStatus = false;
          }
        );
      });
    }
    // else{
    //   console.log('found url in local storage');
    // }
  }

  getExpirationTimestamp(sigedUrl: any) {
    //url expiration time is 15 min
    const url = new URL(sigedUrl);
    const expirationParam = url.searchParams.get('X-Amz-Expires');

    if (expirationParam) {
      const expirationInSeconds = parseInt(expirationParam, 10);
      const expirationTimestamp = Date.now() + expirationInSeconds * 1000; // Convert seconds to milliseconds

      return new Date(expirationTimestamp);
    } else {
      return null; // Expiration parameter not found
    }
  }

  copy() {
    if (this.fileContentStatus && this.fileContent) {
      const textArea = document.createElement('textarea');
      textArea.value = this.fileContent;

      // Ensure it's not visible and added to the DOM
      textArea.style.position = 'fixed';
      document.body.appendChild(textArea);

      textArea.select();

      try {
        document.execCommand('copy'); // Copy the text to the clipboard
        this.toolTip = true;
        setTimeout(() => {
          this.toolTip = false;
        }, 3000);
      } catch (err) {
        console.error('Unable to copy to clipboard');
      }

      document.body.removeChild(textArea); // Clean up
    }
  }

  async downloadFile(fileId: string, fileUserId: string, filename: string) {
    //future scope - if model is opened i.e downloadUrl is fetched already don't fetch it again, directky usr existing fileDownloadUrl

    try {
      await this.getDownloadUrl(fileId, fileUserId, filename);
      if (this.fileDownloadurl) {
        try {
          // Attempt to download the file with MIME type detection
          const response = await this.http
            .get(this.fileDownloadurl, { responseType: 'blob' })
            .toPromise();

          if (!response) {
            console.error('Response is undefined');
            //errMsg
            this.errMessage = 'Error fetching the file';
            this.displayErrMsg();
            return;
          }

          const blob = new Blob([response]);
          const contentType = response.type;

          let fileExtension = 'unknown'; // Default to .txt if unknown

          if (contentType) {
            const mimeTypes: { [key: string]: string } = {
              'image/png': 'png',
              'image/jpeg': 'jpg',
              'text/plain': 'txt',
              'application/javascript': 'js',
              'text/javascript': 'js',
              'application/pdf': 'pdf', // Add PDF mapping
              'application/msword': 'doc', // Add DOC mapping
              'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                'docx', // Add DOCX mapping
              'application/zip': 'zip', // Add ZIP mapping
              'application/x-pdf': 'pdf', // Another possible PDF MIME type
              'application/vnd.ms-excel': 'xls',

              // Add more MIME type to file extension mappings as needed
              //add mapping for apk files
            };

            fileExtension = mimeTypes[contentType] || 'unknown'; // Fallback to unknown if unknown

            if (fileExtension === 'unknown') {
              fileExtension =
                (filename.includes('.')
                  ? filename.split('.').pop()?.toLowerCase()
                  : 'unknown') || 'unknown';
            }
          }

          const fileName = `codefile.${fileExtension}`;
          this.triggerDownload(blob, fileName);
        } catch (error) {
          // If MIME type detection fails, fall back to file extension detection
          console.error('MIME type detection failed:', error);

          const fileExtension =
            (filename.includes('.')
              ? filename.split('.').pop()?.toLowerCase()
              : 'unknown') || 'unknown';

          // if (fileExtension === 'unknown') {
          //   console.error('Unable to determine file type');
          //   return;
          // }

          const fileName = `codefile.${fileExtension}`;
          this.triggerDownloadFromUrl(this.fileDownloadurl, fileName);
        }
      } else {
        //errMsg
        this.errMessage = 'Error fetching the file';
        this.displayErrMsg();
      }
    } catch (error) {
      this.errMessage = 'Something went wrong, Please try again later';
      this.displayErrMsg();
    }
  }

  private triggerDownload(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private async triggerDownloadFromUrl(url: string, fileName: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      this.triggerDownload(blob, fileName);
    } catch (error) {
      console.error('Error fetching file content:', error);
      //errMsg
      this.errMessage = 'Error downloading the file';
      this.displayErrMsg();
    }
  }

  close(): void {
    this.modalRef.hide();
  }

  openDeleteModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
  }

  deleteFile(fileId: any, userId: any, fileName: any) {
    this.modalRef.hide();
    this.codesSharingService.deleteFile(fileId, userId, fileName).subscribe({
      next: (data: any) => {
        console.log('file deleted');

        this.allFilesInfo = this.allFilesInfo.filter(
          (file: { [x: string]: any }) => file['_id'] != fileId
        );
        //successMsg
      },
      error: (err: any) => {
        console.log('error deleteing file', err);
        //errMsg
        this.errMessage = 'Error while deleting the file';
        this.displayErrMsg();
      },
    });
  }

  cancel(): void {
    this.modalRef.hide();
  }

  public displayErrMsg() {
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
      icon: 'error',
      title: this.errMessage,
    });
  }

  searchQuery: string = '';
  shouldFilter: boolean = false;
  

  onSearch() {
    if (this.searchQuery) {
      console.log(this.searchQuery);
      this.shouldFilter = true;
      this.filteredfiles = this.files.filter((files: any) =>
        files.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
      this.allFilesInfo = this.filteredfiles;
    } else {
      this.shouldFilter = false;
      this.allFilesInfo = this.files;
    }
  }

  resetFilter() {
    this.searchQuery = '';
    this.shouldFilter = false;
    this.allFilesInfo = this.files;
  }

}
