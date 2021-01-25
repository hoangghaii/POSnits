import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { MenuRegistration } from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class MenuRegistrationService extends HttpService {
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
  getSetMenuList(shopId: string): Observable<MenuRegistration[]> {
    const url = this.apiUrl + `shops/${shopId}/setmenus`;
    return this.http.get<MenuRegistration[]>(url).pipe(
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
  updateSetMenuListSort(obj: any): Observable<any> {
    const url = this.apiUrl + `shops/${obj.shopId}/setmenus`;
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
  ): Observable<MenuRegistration[]> {
    const url = this.apiUrl + `shops/${shopId}/setmenus/${setmenuId}`;
    return this.http.get<MenuRegistration[]>(url).pipe(
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
    obj: MenuRegistration[]
  ): Observable<MenuRegistration[]> {
    const url = this.apiUrl + `shops/${shopId}/setmenus/${obj[0].id}`;
    return this.http.put<MenuRegistration[]>(url, obj).pipe(
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
