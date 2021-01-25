import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpService} from '../http.service';
import {environment as env} from 'src/environments/environment';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConditionalSearchService extends HttpService {
  apiUrl = env.BASE_URL + 'shops';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * 検索結果リストを取得する
   * @param shopId
   * @param day_type
   * @param target_day_from
   * @param target_day_to
   * @param birthday_from
   * @param birthday_to
   * @param age_from
   * @param age_to
   * @param sex_type
   * @param visit_amount_from
   * @param visit_amount_to
   * @param visit_amount_type
   * @param sale_from
   * @param sale_to
   * @param sale_type
   * @param menus
   * @param menus_select_type
   */
  getSearchResultList(shopId: string, day_type?: string, target_day_from?: string,
                      target_day_to?: string, birthday_from?: string, birthday_to?: string,
                      age_from?: string, age_to?: string, sex_type?: string,
                      visit_amount_from?: string, visit_amount_to?: string,
                      visit_amount_type?: string, sale_from?: string, sale_to?: string,
                      sale_type?: string, menus?: string, menus_select_type?: string,): Observable<any[]> {
    const conditionalSearchParrams = {
      day_type: day_type,
      target_day_from: target_day_from,
      target_day_to: target_day_to,
      birthday_from: birthday_from,
      birthday_to: birthday_to,
      age_from: age_from,
      age_to: age_to,
      sex_type: sex_type,
      visit_amount_from: visit_amount_from,
      visit_amount_to: visit_amount_to,
      visit_amount_type: visit_amount_type,
      sale_from: sale_from,
      sale_to: sale_to,
      sale_type: sale_type,
      menus: menus,
      menus_select_type: menus_select_type,
    };
    return this.http.get<any>(this.apiUrl + '/' + shopId + '/' + 'search_results', {params: conditionalSearchParrams}).pipe(
      map((res: any[]) => {
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
   * 結果を取得
   * @param shopId
   * @param day_type
   * @param target_day_from
   * @param target_day_to
   * @param birthday_from
   * @param birthday_to
   * @param age_from
   * @param age_to
   * @param sex_type
   * @param visit_amount_from
   * @param visit_amount_to
   * @param visit_amount_type
   * @param sale_from
   * @param sale_to
   * @param sale_type
   * @param menus
   * @param menu_select_type
   */
  getResult(shopId: string, day_type?: any, target_day_from?: any, target_day_to?: any,
            birthday_from?: any, birthday_to?: any, age_from?: any, age_to?: any, sex_type?: any,
            visit_amount_from?: any, visit_amount_to?: any, visit_amount_type?: any, sale_from?: any,
            sale_to?: any, sale_type?: any, menus?: any, menu_select_type?: any,): Observable<any[]> {
    const conditionalSearchParrams = {
      day_type: day_type,
      target_day_from: target_day_from,
      target_day_to: target_day_to,
      birthday_from: birthday_from,
      birthday_to: birthday_to,
      age_from: age_from,
      age_to: age_to,
      sex_type: sex_type,
      visit_amount_from: visit_amount_from,
      visit_amount_to: visit_amount_to,
      visit_amount_type: visit_amount_type,
      sale_from: sale_from,
      sale_to: sale_to,
      sale_type: sale_type,
      menus: menus,
      menu_select_type: menu_select_type,
    };

    return this.http.get<any>(this.apiUrl + '/' + shopId + '/' + 'getlist_result', {params: conditionalSearchParrams}).pipe(
      map((res: any[]) => {
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
   * 検索結果を作成する
   * @param shopId
   * @param body
   */
  createSearchResult(shopId: string, body: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/' + shopId + '/' + 'search_results', body).pipe(
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
   * 検索結果を取得する
   * @param shopId
   * @param searchResultId
   */
  getSearchResult(shopId: string, searchResultId: string): Observable<any> {
    return this.http.get<any>(this.apiUrl + '/' + shopId + '/' + 'search_results' + '/' + searchResultId).pipe(
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
   * 検索結果を更新する
   * @param shopId
   * @param body
   */
  updateSearchResult(shopId: string, body: any): Observable<any> {
    return this.http.put<any>(this.apiUrl + '/' + shopId + '/' + 'search_results' + '/' + body[0].id, body).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          return this.handleError(e);
        }
      }));
  }

  /**
   * 検索結果を削除する
   * @param shopId
   * @param searchResultId
   */
  deleteSearchResult(shopId: string, searchResultId: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + '/' + shopId + '/' + 'search_results' + '/' + searchResultId).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          return this.handleError(e);
        }
      }));
  }
  public listResult = [];
  public id :number;
  exportCSV(list:any[],shopId :string):Observable<any>{
    return this.http.post(this.apiUrl + '/' + shopId + '/export_search', list,{responseType:'blob'}).pipe(
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
    )
  }
  exportCSV2(list:any[],shopId :string):Observable<any>{
    return this.http.post(this.apiUrl + '/' + shopId + '/export_search_infor', list,{responseType:'blob'}).pipe(
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
    )
  }
}
