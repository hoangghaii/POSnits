import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Product} from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get items
   *
   * @param {String} shopId
   *
   * @return {Observable}
   */
  getListProduct(shopId: string): Observable<Product[]> {
    const url = this.apiUrl + `shops/${shopId}/items`;
    return this.http.get<Product[]>(url).pipe(
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
   * Create item
   *
   * @param {Object} item
   * @param {String} shopId
   *
   * @return {Observable}
   */
  createItem(item: Product, shopId: string): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/items`;
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
   * Get item
   *
   * @param {String} shopId
   * @param {String} item
   *
   * @return {Observable}
   */
  getItem(shopId: string, idItem: string): Observable<Product> {
    const url = this.apiUrl + `shops/${shopId}/items/${idItem}`;
    return this.http.get<Product>(url).pipe(
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
   * Update item
   *
   * @param {String} shopId
   * @param {Object} item
   *
   * @return {Observable}
   */
  updateItem(shopId: string, item: Product): Observable<Product> {
    const url = this.apiUrl + `shops/${shopId}/items/${item.id}`;
    return this.http.put<Product>(url, item).pipe(
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
   * Delete product item
   *
   * @param {String} shopId
   * @param {String} itemId
   *
   * @return {Observable}
   */
  deleteItem(shopId: string, itemId: string): Observable<Product> {
    const url = this.apiUrl + `shops/${shopId}/items/${itemId}`;
    return this.http.delete(url).pipe(
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
   * Update products
   *
   * @param {Object} item
   *
   * @return {Observable}
   */
  updateListItems(item): Observable<Product[]> {
    const url = this.apiUrl + `shops/${item.shopId}/items`;
    return this.http.put(url, item).pipe(
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
