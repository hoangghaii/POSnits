import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { ShopMail } from 'src/app/core/models';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopMailService  extends HttpService{
  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get shop_mail list
   * @param shopId
   */
  getShopMailList(shopId :string): Observable<ShopMail[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_mails`;
    return this.http.get<ShopMail[]>(url).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Create shop_mail
   * @param shopId
   * @param obj
   */
  createShopMail(shopId: string, obj: ShopMail): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/shop_mails`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get shop_mail
   * @param shopId
   * @param shopMailId
   */
  getShopMail(shopId: string, shopMailId: string): Observable<ShopMail> {
    const url = `${this.apiUrl}shops/${shopId}/shop_mails/${shopMailId}`;
    return this.http.get<ShopMail>(url)
      .pipe(
        map(res => {
          if (res) {
            return res;
          }
        }),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Update shop_mail
   * @param shopId
   * @param shopMailId
   * @param obj
   */
  updateShopMail(shopId: string, obj: ShopMail) {
    const url = `${this.apiUrl}shops/${shopId}/shop_mails`;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete shop_mail
   * @param shopId
   * @param shopMailId
   */
  deleteShopMail(shopId: string) {
    const url = `${this.apiUrl}shops/${shopId}/shop_mails`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
