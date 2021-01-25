import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';
import {Discount} from 'src/app/core/models';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class DiscountService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get Discounts
   * @param {Number} shopId
   *
   * @return {Observable}
   */
  getDiscountList(shopId: string): Observable<Discount[]> {
    const url = this.apiUrl + `shops/${shopId}/discounts`;
    return this.http.get<Discount[]>(url).pipe(
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
   * Get discount
   *
   * @param {Number} shopId
   * @param {Number} discountId
   *
   * @return {Observable}
   */
  getDiscount(shopId: string, discountId: string): Observable<Discount[]> {
    const url = this.apiUrl + `shops/${shopId}/discounts/${discountId}`;
    return this.http.get<Discount[]>(url).pipe(
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
   * Update discount
   *
   * @param {Object} objDiscount
   *
   * @return {Observable}
   */
  createDiscount(objDiscount: any): Observable<any> {
    const url = this.apiUrl + `shops/${objDiscount.shop_id}/discounts`;
    return this.http.post(url, objDiscount).pipe(
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
   * Update discount
   *
   * @param {Object} objDiscount
   *
   * @return {Observable}
   */
  updateDiscount(objDiscount: any): Observable<any> {
    const url = this.apiUrl + `shops/${objDiscount.shop_id}/discounts/${objDiscount.id}`;
    return this.http.put(url, objDiscount).pipe(
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
   * Update position of the discount
   *
   * @param {Object} objDiscount
   *
   * @return {Observable}
   */
  updateSortDiscount(objDiscount: any): Observable<any> {
    const url = this.apiUrl + `shops/${objDiscount.shop_id}/discounts`;
    return this.http.put(url, objDiscount).pipe(
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
   * Delete discount
   *
   * @param {Number} shopId
   * @param {Number} discountId
   *
   * @return {Observable}
   */
  deleteDiscount(shopId, discountId): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/discounts/${discountId}`;
    return this.http.delete(url).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }
}
