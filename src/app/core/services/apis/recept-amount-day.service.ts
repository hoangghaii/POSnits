import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import { HttpService } from '../http.service';
@Injectable({
  providedIn: 'root'
})
export class ReceptAmountDayService extends HttpService {
  private apiUrl = env.BASE_URL;
  constructor(private http: HttpClient) {
    super();
  }
  /**
   * 日中のレシピを作成する
   * @param reserv_receptId 
   * @param item 
   */
  createReceipts(reserv_receptId: string, item :any): Observable<any> {
  
    return this.http.post<any>(`${this.apiUrl}reserv_recepts/${reserv_receptId}/recept_amount_daies`, item).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }
  /**
   * 日中のレシピを取得
   * @param reserv_receptId 
   */
  getRecept(reserv_receptId: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}reserv_recepts/${reserv_receptId}/recept_amount_daies`).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }
  /**
   * 日中のレシピを更新する
   * @param reserv_receptId 
   * @param item 
   */
  update(reserv_receptId: string, item :any): Observable<any>{
    return this.http.put<any>(`${this.apiUrl}reserv_recepts/${reserv_receptId}/recept_amount_daies`, item).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }
}
