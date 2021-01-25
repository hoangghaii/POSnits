import {HttpService} from '../http.service';
import {environment as env} from 'src/environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {SetMenu} from 'src/app/core/models';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SetMenuService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * セットメニューリストを取得
   *
   * @param shopId
   *
   * @return {Observable}
   */
  getSetMenuList(shopId: string): Observable<SetMenu[]> {
    const url = this.apiUrl + `shops/${shopId}/setmenus`;
    return this.http.get<SetMenu[]>(url).pipe(
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
   * セットメニューリストの並べ替えを更新
   *
   * @param obj
   *
   * @return {Observable}
   */
  updateSetMenuListSort(shopId, obj: any): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/setmenus`;
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
   * セットメニューを作成する
   *
   * @param shopId
   * @param obj
   *
   * @return {Observable}
   */
  createSetMenu(shopId: string, obj: any): Observable<any[]> {
    const url = this.apiUrl + `shops/${shopId}/setmenus`;
    return this.http.post<any[]>(url, obj).pipe(
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
   * セットメニューを取得
   *
   * @param shopId
   * @param setmenuId
   *
   * @return {Observable}
   */
  getSetMenu(
    shopId: string,
    setmenuId: string
  ): Observable<SetMenu[]> {
    const url = this.apiUrl + `shops/${shopId}/setmenus/${setmenuId}`;
    return this.http.get<SetMenu[]>(url).pipe(
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
   * セットメニューの更新
   *
   * @param shopId
   * @param setmenuId
   * @param obj
   *
   * @return {Observable}
   */
  updateSetMenu(
    shopId: string,
    obj: SetMenu
  ): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/setmenus/${obj.id}`;
    return this.http.put<any>(url, obj).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }

  /**
   * セットメニューを削除
   *
   * @param shopId
   * @param setmenuId
   */
  deleteSetMenu(shopId: any, setmenuId: any): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/setmenus/${setmenuId}`;
    return this.http.delete(url).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }

  /**
   * Get Shop Menu List
   *
   * @param shopId
   *
   * @return {Observable}
   */
  getShopMenuList(shopId: string): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/shop_menus`;
    return this.http.get<any>(url).pipe(
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
