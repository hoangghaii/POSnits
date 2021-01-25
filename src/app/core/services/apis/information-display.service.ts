import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {HttpService} from '../http.service';
import {environment as env} from 'src/environments/environment';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class InformationDisplayService extends HttpService {

  constructor(private http: HttpClient) {
    super();
  }

  private apiUrl = (shopId: string = '') => `${env.BASE_URL}shops/${shopId}/shop_view`;

  /**
   * 情報表示を取得
   * @param shopId
   */
  getInformationDispay(shopId: string) {
    return this.http.get((this.apiUrl(shopId) + '/' + `${shopId}`)).pipe(
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
   * リスト情報表示を取得
   * @param shopId
   */
  getListInformationDispay(shopId: string) {
    return this.http.get(this.apiUrl(shopId)).pipe(
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
   * 情報表示を作成する
   * @param shopId
   * @param information
   */
  createInformationDispay(shopId: string, information: any) {
    return this.http.post(this.apiUrl(shopId), information).pipe(
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
   * 情報表示の更新
   * @param shopId
   * @param information
   */
  updateInformationDispay(shopId: string, information: any) {
    return this.http.put(this.apiUrl(shopId) + '/' + `${information.id}`, information).pipe(
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
