import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class VouchersService extends HttpService {
  private apiUrl = env.BASE_URL + 'shops';
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Create vouchers 
   */
  createVouchers(shopId: string, saleIds: string, outputType: string): Observable<any> {
    const param = { saleId: saleIds, output_type: outputType };
    return this.http.post(this.apiUrl + `/${shopId}/vouchers`, null, { params: param }).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }
}
