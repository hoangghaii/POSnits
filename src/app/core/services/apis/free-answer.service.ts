import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {FreeAnswer} from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class FreeAnswerService extends HttpService {
  apiCustormerUrl = env.BASE_URL + 'customers';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get free answer list
   *
   * @param {string} custormerId
   *
   * @return {Observable<FreeAnswer[]>}
   */
  getFreeAnswerList(custormerId: string): Observable<FreeAnswer[]> {
    return this.http
      .get<FreeAnswer[]>(
        this.apiCustormerUrl + '/' + custormerId + '/free_answers'
      )
      .pipe(
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
   * Update free snswer list
   *
   * @param {string} custormerId
   * @param {any} obj
   *
   * @return {Observable<any>}
   */
  updateFreeAnswerList(custormerId: string, freeAnswer: FreeAnswer[]): Observable<any> {
    return this.http
      .put(this.apiCustormerUrl + '/' + custormerId + '/free_answers', freeAnswer)
      .pipe(
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
   * Add new free answer
   *
   * @param {string} custormerId
   * @param {FreeItem} obj
   *
   * @return {Observable<any>}
   */
  createFreeAnswer(custormerId: string, freeAnswer: FreeAnswer[]): Observable<any> {
    return this.http
      .post(this.apiCustormerUrl + '/' + custormerId + '/free_answers', freeAnswer)
      .pipe(
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
