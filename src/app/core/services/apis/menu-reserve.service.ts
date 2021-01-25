import {Injectable} from '@angular/core';
import {HttpService} from '../http.service';
import {environment as env} from 'src/environments/environment';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MenuReserveService extends HttpService {
  private apiUrl = (shopId: string = '') =>
    `${env.BASE_URL}shops/${shopId}/reserve_menus`;
  public listMenu: any[] = [];

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * メールリストを取得する
   * @param shopId
   */
  getListReserveMenu(shopId: string) {
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

  addData(item) {
    this.listMenu.push(item);
  }

  getData(): any[] {
    return this.listMenu;
  }

  resetList() {
    this.listMenu = [];
  }

  isExist(item) {
    let flag = false;
    this.listMenu.forEach((subiItem) => {
      if ((JSON.stringify(subiItem) === JSON.stringify(item)) == true) {
        flag = true;
      }
    });
    return flag;
  }
}
