import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment as env } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SalesTrendsService  extends HttpService{
  apiUrl = env.BASE_URL + 'shops';
  constructor(private http: HttpClient) {
    super();
   }
   /**
    * ReservationListを取得する
    * @param shopId 
    * @param target_type 
    * @param target_month 
    * @param staff_id 
    */
   getReservationList(shopId: string, target_type: string, target_month: string, staff_id: string):Observable<any[]> {
    const params = {target_type: target_type, staff_id: staff_id, target_month: target_month};
      return this.http.get<[]>(this.apiUrl + '/' + shopId + '/sales_trends', {params: params}).pipe(
          map((res: any) => {
              if (res) {
                  return res;
              }
          }),
          catchError((e) => {
              if (e instanceof HttpErrorResponse) {
                  return this.handleError(e);
              }
          })
      )
  }
  /**
   * CSVをエクスポート
   * @param shopId 
   * @param target_type 
   * @param target_month 
   * @param staff_id 
   */
  exportCSV(shopId: string, target_type: string, target_month: string, staff_id: string):Observable<any>{
    const params = {target_type: target_type, staff_id: staff_id, target_month: target_month};
    let obj = {
        target_type: target_type, staff_id: staff_id, target_month: target_month
    }
    return this.http.post(this.apiUrl + '/' + shopId + '/sales_trends', obj,{responseType:'blob'}).pipe(
        map((res: any) => {
            if (res) {
                return res;
            }
        }),
        catchError((e) => {
            if (e instanceof HttpErrorResponse) {
                return this.handleError(e);
            }
        })
    )
  }
}
