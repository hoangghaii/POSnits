import {Injectable} from '@angular/core';
import {environment as env} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {HttpService} from '../http.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StoreService extends HttpService {
  private apiUrl = env.BASE_URL + 'shops';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Add store
   *
   * @param {Object} objStore
   *
   * @return {Observable}
   */
  addStore(objStore): Observable<any> {
    return this.http.post(this.apiUrl, objStore).pipe(
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
   * Get store
   *
   * @param {String} shopId
   *
   * @return {Observable}
   */
  getStores(shopId): Observable<any> {
    return this.http.get<any[]>(this.apiUrl + `/${shopId}`).pipe(
      map(res => {
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
   * 店舗情報を更新
   *
   * @param {String} shopId
   * @param {Object} obj
   *
   * @return {Observable}
   */
  updateStores(shopId: string, obj: any): Observable<any> {
    const url = this.apiUrl + '/' + shopId;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 店舗情報を削除する
   *
   * @param {String} shopId
   *
   * @return {Observable}
   */
  deleteStores(shopId: string): Observable<any> {
    const url = this.apiUrl + '/' + shopId;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
