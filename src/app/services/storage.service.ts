import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    // Start a timer to periodically clean up expired URLs only in the browser
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        this.cleanUpExpiredUrls();
      }, 60000); // 1 minute (60 seconds)
    }
  }

  private downloadUrls: { fileId: string, url: string, expiresAt: Date | null }[] = [];

  public setRole(role: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("role", role);
    }
  }

  public getRole() {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem("role") : null;
  }

  public setStorage(storage: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("storage", storage);
    }
  }

  public getStorage() {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem("storage") : null;
  }

  public setToken(jwtToken: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("token", jwtToken);
    }
  }

  public getToken() {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem("token") : null;
  }

  public getResetToken() {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem("resetToken") : null;
  }

  public setEnquirySubmitted() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("enquirySubmitted", "true");
    }
  }

  public clear() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  public isLoggedIn() {
    return this.getRole() && this.getToken();
  }

  // Add a new URL with fileId to the array
  public addDownloadUrl(fileId: string, url: string, expiresAt: Date | null) {
    const existingIndex = this.downloadUrls.findIndex(item => item.fileId === fileId);

    if (existingIndex !== -1) {
      // Update the existing entry
      this.downloadUrls[existingIndex] = { fileId, url, expiresAt };
    } else {
      // Add a new entry
      this.downloadUrls.push({ fileId, url, expiresAt });
    }

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem("downloadUrls", JSON.stringify(this.downloadUrls));
    }
  }

  // Retrieve the array of URLs with fileId
  public getDownloadUrls() {
    return isPlatformBrowser(this.platformId) ? JSON.parse(localStorage.getItem("downloadUrls") || '[]') : [];
  }

  // Get the download URL for a specific fileId
  public getDownloadUrlByFileId(fileId: string) {
    const storedUrls = this.getDownloadUrls();
    const matchingUrl = storedUrls.find((item: { fileId: string; }) => item.fileId === fileId);
    return matchingUrl ? matchingUrl.url : null;
  }

  private cleanUpExpiredUrls() {
    // Ensure clean-up happens only in the browser
    if (isPlatformBrowser(this.platformId)) {
      console.log('URL clearing');
      const currentTime = Date.now();
      this.downloadUrls = this.downloadUrls.filter(item => item.expiresAt !== null && item.expiresAt.getTime() > currentTime);

      localStorage.setItem("downloadUrls", JSON.stringify(this.downloadUrls));
    }
  }
}


// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class StorageService {

//   constructor() { }
// }
