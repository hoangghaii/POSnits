import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ShopTerm } from 'src/app/core/models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopTermService extends HttpService {
  baseUrl = environment.BASE_URL;
  constructor(
    private http: HttpClient,
    ) {
      super();
     }

  /**
   * Get Shop Term
   * @param shopId
   */
  getShopTerm(shopId: number): Observable<ShopTerm[]>{
    const url = this.baseUrl + `shops/${shopId}/shopterms`;
    return this.http.get<ShopTerm[]>(url).pipe(
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
   * Create Shop Term
   * @param shopId
   * @param shopTerm
   */
  createShopTerm(shopId: number, shopTerm: ShopTerm): Observable<ShopTerm> {
    const url = this.baseUrl + `shops/${shopId}/shopterms`;
    return this.http.post(url, shopTerm).pipe(
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
   * Update Shop Term
   * @param shopId
   * @param shopTerm
   */
  updateShopTerm(shopId: number, shopTerm: ShopTerm): Observable<ShopTerm>{
    const url = this.baseUrl + `shops/${shopId}/shopterms`;
    return this.http.put<ShopTerm>(url, shopTerm).pipe(
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
   * Delete Shop Term
   * @param shopId
   */
  deleteShopTerm(shopId:string): Observable<ShopTerm>{
    const url = this.baseUrl + `shops/${shopId}/shopterms`;
    return this.http.delete<ShopTerm>(url).pipe(
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
