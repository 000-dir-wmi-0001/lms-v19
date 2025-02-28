import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReceiptService {
  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) { }

  setReceiptEntries(formData: any): Observable<any> {
    return this.http.post(`${environment.api}/receipt/createReceipt`, formData,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  verifyPayment(id: any, data: any): Observable<any> {
    return this.http.put(`${environment.api}/receipt/verifyPayment/${id}`, data,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  isFeeComplete(userId: any, module: any) {
    console.log(module, "from service")
    return this.http.get(`${environment.api}/receipt/findReceiptforModule/${userId}`, { params: { module: module }, headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  postUserModules(userId: any): Observable<any> {
    return this.http.post(`${environment.api}/receipt/postUserModules/${userId}`, {},
      { headers: { Authorization: `Bearer ${this.token}` } }

    );
  }
  updateModuleInstallments(id: any, newInstallments: any, moduleId: any) {
    return this.http.put(`${environment.api}/receipt/editInstallments/${id}`, { newInstallments, moduleId },
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
  editModulesPendingFees(userId: any, newPendingFee: number, moduleId: any) {
    return this.http.put(`${environment.api}/receipt/editModulesPendingFees/${userId}`, { newPendingFee, moduleId },
      { headers: { Authorization: `Bearer ${this.token}` } }

    )
  }
  getUserReceipts(id: any) {
    return this.http.get(`${environment.api}/receipt/findPreviousReceipt/${id}`,
      { headers: { Authorization: `Bearer ${this.token}` } }

    );

  }
}
