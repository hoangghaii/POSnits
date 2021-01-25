import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {FreeItem} from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class FreeItemService extends HttpService {
  apiCompaniesUrl = env.BASE_URL + 'companies';
  apiShopsUrl = env.BASE_URL + 'shops';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * スキルリストを取得する
   *
   * @param {string} companyId
   *
   * @return {Observable<FreeItem[]>}
   */
  getFreeItemList(companyId: string): Observable<FreeItem[]> {
    return this.http
      .get<FreeItem[]>(
        this.apiCompaniesUrl + '/' + companyId + '/free_questions'
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
   * Update free item list sort
   *
   * @param {string} companyId
   * @param {any} obj
   *
   * @return {Observable<any>}
   */
  updateFreeItemListSort(obj: any): Observable<any> {
    return this.http
      .put(
        this.apiCompaniesUrl + '/' + obj.companyId + '/free_questions',
        obj.list
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
   * Add new free item
   *
   * @param {string} companyId
   * @param {FreeItem} freeItem
   *
   * @return {Observable<any>}
   */
  createFreeItem(companyId: string, freeItem: FreeItem): Observable<any> {
    return this.http
      .post(
        this.apiCompaniesUrl + '/' + companyId + '/free_questions',
        freeItem
      )
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

  /**
   * Get free item
   *
   * @param {string} companyId
   * @param {string} free_questionId
   *
   * @return {Observable<FreeItem>}
   */
  getFreeItem(companyId: string, freeQuestionId: string): Observable<FreeItem> {
    return this.http
      .get<FreeItem>(this.apiShopsUrl + '/' + companyId + '/free_questions/' + freeQuestionId).pipe(
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
   * Update free item
   *
   * @param {string} companyId
   * @param {string} free_questionId
   * @param {FreeItem} freeItem
   *
   * @return {Observable<FreeItem>}
   */
  updateFreeItem(companyId: string, freeQuestionId: string, freeItem: FreeItem): Observable<FreeItem> {
    return this.http.put(
      this.apiShopsUrl + '/' + companyId + '/free_questions/' + freeQuestionId, freeItem)
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
   * Delete free item
   *
   * @param {string} companyId
   * @param {string} free_questionId
   *
   * @return {Observable<FreeItem>}
   */
  deleteFreeItem(companyId: string, freeQuestionId: string): Observable<any> {
    return this.http
      .delete(
        this.apiShopsUrl +
        '/' +
        companyId +
        '/free_questions/' +
        freeQuestionId
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
}
