import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpService } from '../http.service';
import {environment as env} from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { __param } from 'tslib';
@Injectable({
  providedIn: 'root'
})
export class ListOfVisitTodayService extends HttpService{
  private apiUrl = (shopId: string = '') => `${env.BASE_URL}shops/${shopId}/reservation_menu`;
  constructor( private http: HttpClient) { 
    super();
  }
  /**
   * メニューIDを取得する
   * @param shopId 
   * @param object 
   */
  getMenuId(shopId: string, object:any):  Observable<any>{
   return   this.http.get(this.apiUrl(shopId)+'/'+`menu_id`+'/'+object.menu_id+'/'+`category_cd`+'/'+object.category_cd).pipe(
     
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
