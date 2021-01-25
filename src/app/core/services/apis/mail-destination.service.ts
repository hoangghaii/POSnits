import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {HttpService} from '../http.service';
import {environment as env} from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MailDestinationService extends HttpService {

   
  constructor(
    private http: HttpClient
   
  ) {  super();}
    private apiUrl = (shopId: string = '') => `${env.BASE_URL}shops/${shopId}/shop_mail_destinations`;
  /**
   * 新しいメーリングリストを作成する
   * @param shopId 
   * @param mailDestiantions 
   */
  createListMailDestination(shopId: string, mailDestiantions: any) {
    return this.http.post(this.apiUrl(shopId), mailDestiantions).pipe(
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
   * メールリストを取得する
   * @param shopId 
   */
  getListMailDestination(shopId: string) {
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
   * メールを受け取る
   * @param shopId 
   * @param mailId 
   */
  getMailDestination(shopId: string, mailId: string){
    return this.http.get(this.apiUrl(shopId)+ '/' + mailId).pipe(
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
   * 新しい電子メールの更新を作成する
   * @param shopId 
   * @param mailDestiantions 
   */
  createOrUpdate(shopId: string, mailDestiantions: any){
    return this.http.post(this.apiUrl(shopId),mailDestiantions).pipe(
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
  updateMail(shopId: string, mailDestiantions: any){
    return this.http.put(this.apiUrl(shopId)+'/'+mailDestiantions.id,mailDestiantions).pipe(
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
  deleteMail(shopId: string, mailDestiantions: any){
    return this.http.delete(this.apiUrl(shopId)+'/'+mailDestiantions.id,mailDestiantions).pipe(
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
