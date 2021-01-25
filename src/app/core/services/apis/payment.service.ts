import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class PaymentService extends HttpService {
  private baseUrl = environment.BASE_URL;

  /**
   * コンストラクタ
   * @param http
   */
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * リスト支払いを取得する
   * @param shopId
   * @param item
   */
  createPayment(shopId: string, item: any[]) {
    const url = this.baseUrl + `shops/${shopId}/payments`;
    return this.http.post(url, item).pipe(
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
   * 支払いを削除する
   * @param shopId
   * @param paymentId
   */
  deletePayment(shopId: string, paymentId: string) {
    const url = this.baseUrl + `shops/${shopId}/payments/${paymentId}`;
    return this.http.delete(url, {}).pipe(
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
   * 支払いの更新
   * @param shopId
   * @param obj
   */
  updatePayment(shopId: string, obj: any[]) {
    const url = this.baseUrl + `shops/${shopId}/payments/${obj[0].id}`;
    return this.http.put(url, obj).pipe(
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
   * 支払いを受け取る
   * @param shopId
   * @param paymentId
   */
  getPayment(shopId: string, paymentId: string) {
    const url = this.baseUrl + `shops/${shopId}/payments/${paymentId}`;
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
   * リスト支払いを取得する
   * @param shopId
   */
  getListPayment(shopId: string) {
    const url = this.baseUrl + `shops/${shopId}/payments`;
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
   * リスト支払いを更新する
   * @param body
   */
  updateListPayments(body) {
    const url = this.baseUrl + `shops/${body.shopId}/payments`;
    return this.http.put(url, body).pipe(
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
