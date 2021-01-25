import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
@Injectable({
  providedIn: 'root'
})
export class ReceiptsService extends HttpService {
  private apiUrl = env.BASE_URL + 'shops/';
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Create receipts
   */
  createReceipts(shopId: string, saleId: string, outputType: string, billPdf: string): Observable<any> {
    const obj = {sale_id: saleId, output_type: outputType, bill_pdf: billPdf};
    return this.http.post<any>(`${this.apiUrl}${shopId}/receipts`, null, {params: obj}).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }
}
