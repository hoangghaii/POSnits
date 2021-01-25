import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { AccoutingCustody } from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class AccoutingCustodyService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * セールリストを取得
   * @param shopId
   */
  getSaleList(shopId: string): Observable<AccoutingCustody[]> {
    const url = this.apiUrl + `shops/${shopId}/sales`;
    return this.http.get<AccoutingCustody[]>(url).pipe(
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
   * セールを作成する
   * @param shopId
   * @param obj
   */
  createSale(shopId: string, obj: any): Observable<any[]> {
    const url = this.apiUrl + `shops/${shopId}/sales`;
    return this.http.post<any[]>(url, obj).pipe(
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
   * セールを取得
   * @param shopId
   * @param saleId
   */
  getSale(shopId: string, saleId: string): Observable<AccoutingCustody[]> {
    const url = this.apiUrl + `shops/${shopId}/sales/${saleId}`;
    return this.http.get<AccoutingCustody[]>(url).pipe(
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
   * セールの更新
   * @param shopId
   * @param saleId
   * @param obj
   */
  updateSale(
    shopId: string,
    saleId: string,
    obj: AccoutingCustody
  ): Observable<AccoutingCustody[]> {
    const url = this.apiUrl + `shops/${shopId}/sales/${saleId}`;
    return this.http.put<AccoutingCustody[]>(url, obj).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }

  /**
   * セールを削除
   * @param shopId
   * @param saleId
   */
  deleteSale(shopId: any, saleId: any): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/sales/${saleId}`;
    return this.http.delete(url).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }
}
