import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import { environment as env } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
/**
 * CouponMenuRegistrationService
 * クーポンメニュー登録サービス
 */
export class CouponMenuService extends HttpService {

  private apiUrl = (shopId: string = '') => `${env.BASE_URL}shops/${shopId}/coupons`;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get coupon menus
   *
   * @param shopId
   * @param item
   *
   * @return Observable
   */
  getCouponMenus(shopId: string): Observable<any> {
    return this.http.get(this.apiUrl(shopId)).pipe(
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

  /**
   * Get coupon menus
   *
   * @param shopId
   * @param item
   *
   * @return Observable
   */
  getCouponMenu(shopId: string, couponId): Observable<any> {
    return this.http.get(this.apiUrl(shopId) + '/' + couponId).pipe(
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

  /**
   * Update coupons
   *
   * @param shopId
   * @param item
   *
   * @return Observable
   */
  updateCoupon(shopId: string, coupon): Observable<any> {
    return this.http.put(this.apiUrl(shopId) + '/' + coupon.id, coupon).pipe(
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

  /**
   * Create coupon
   *
   * @param shopId
   * @param item
   *
   * @return Observable
   */
  createCoupon(shopId: string, item): Observable<any> {
    return this.http.post(this.apiUrl(shopId), item).pipe(
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

  /**
   * Delete coupon menu
   *
   * @param shopId
   * @param couponMenuId
   */
  deleteCouponMenu(shopId: any, couponMenuId: any): Observable<any> {
    return this.http.delete(this.apiUrl(shopId) + `/${couponMenuId}`).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }

  /**
   * Update coupons
   *
   * @param shopId
   * @param item
   *
   * @return Observable
   */
  updateSortCoupon(shopId: string, coupon: any): Observable<any> {
    return this.http.put(this.apiUrl(shopId), coupon).pipe(
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
