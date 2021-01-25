import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Tax} from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class TaxService extends HttpService {
  apiUrl = environment.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get taxes
   *
   * @param {String} shopId
   *
   * @return {Observable}
   */
  getTaxList(shopId: string): Observable<Tax[]> {
    const url = this.apiUrl + `shops/${shopId}/taxes`;
    return this.http.get<Tax[]>(url).pipe(
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
   * Get tax
   *
   * @param {String} shopId
   * @param {String} taxId
   *
   * @return {Observable}
   */
  getTax(shopId: string, taxId: number): Observable<Tax> {
    const url = this.apiUrl + `shops/${shopId}/taxes/${taxId}`;
    return this.http.get<Tax>(url).pipe(
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
   * Create tax
   *
   * @param {Object} objTax
   *
   * @return {Observable}
   */
  createTax(objTax: any): Observable<any> {
    const url = this.apiUrl + `shops/${objTax.shop_id}/taxes`;
    return this.http.post(url, objTax).pipe(
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
   * Update tax
   *
   * @param {Object} objTax
   *
   * @return {Observable}
   */
  updateTax(objTax: any): Observable<any> {
    const url = this.apiUrl + `shops/${objTax.shop_id}/taxes/${objTax.id}`;
    return this.http.put(url, objTax).pipe(
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
