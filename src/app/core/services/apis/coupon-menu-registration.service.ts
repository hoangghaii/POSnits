import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import {environment as env} from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
/**
 * CouponMenuRegistrationService
 * クーポンメニュー登録サービス
 */
export class CouponMenuRegistrationService  extends HttpService   {

  private apiUrl = (shopId: string = '') => `${env.BASE_URL}shops/${shopId}/coupons`;

  constructor(
    private http: HttpClient
   ) { 
    super();
  }
  /**
   * クーポンメニュー登録を作成する
   * @param shopId 
   * @param item 
   */
  createCouponMenuRegistration(shopId:string,item: any[]) {
    return this.http.post(this.apiUrl(shopId),item).pipe(
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
    );  
  }
}