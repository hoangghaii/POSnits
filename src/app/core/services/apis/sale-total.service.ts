import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { SaleTotal } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})

export class SaleTotalService extends HttpService {
  baseUrl = env.BASE_URL + 'shops/';

    constructor(private http: HttpClient) {
        super();
    }

    /**
   * Get sales_total
   * @param shopId
   * @param item
   */
  getSaleTotalList(shopId: string, item: SaleTotal) {
    const url = this.baseUrl + `${shopId}/sales_totals?target_day_from=${item.target_day_from}&target_day_to=${item.target_day_to}&staff_id=${item.staff_id}`;
    return this.http.get(url).pipe(
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

  /**
   * Get sales_total output
   * @param shopId
   * @param item
   */
  getSaleTotalOutput(shopId: string, item: SaleTotal): Observable<any> {
    const url = this.baseUrl + `${shopId}/sales_totals?target_day_from=${item.target_day_from}&target_day_to=${item.target_day_to}&staff_id=${item.staff_id}`;
    return this.http.post(url, item, {responseType: 'blob'}).pipe(
      map((res: Blob) => {
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
