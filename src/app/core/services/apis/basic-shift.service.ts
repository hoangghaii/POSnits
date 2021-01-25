import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {BasicShift} from 'src/app/core/models';
import {HttpService} from '../http.service';
@Injectable({
  providedIn: 'root'
})
export class BasicShiftService extends HttpService {

  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staft list
   * @param shopId
   */
  getBasicShiftList(shopId: string): Observable<BasicShift[]> {
    const url = `${this.apiUrl}shops/${shopId}/basic_shifts`;
    return this.http.get<BasicShift[]>(url)
      .pipe(
        map(res => {
          if (res) {
            return res;
          }
        }),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Create BasicShift
   * @param shopId
   * @param obj
   */
  createBasicShift(shopId: string, obj: BasicShift[]): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/basic_shifts`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get BasicShift
   * @param shopId
   * @param BasicShiftId
   */
  getBasicShift(shopId: string, BasicShiftId: string): Observable<BasicShift[]> {
    const url = `${this.apiUrl}shops/${shopId}/basic_shifts/${BasicShiftId}`;
    return this.http.get<BasicShift[]>(url)
      .pipe(
        map(res => {
          if (res) {
            return res;
          }
        }),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Update BasicShift
   * @param shopId
   * @param BasicShiftId
   * @param listBasicShift
   */
  updateBasicShift(shopId: string,obj:BasicShift[],basicShiftId: string) {
    const url = `${this.apiUrl}shops/${shopId}/basic_shifts/${basicShiftId}`;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Update basic shift list sort
   *
   * @param {string} companyId
   * @param {any} obj
   *
   * @return {Observable<any>}
   */
  updateBasicShiftListSort(obj: any): Observable<any> {
    const url = `${this.apiUrl}shops/${obj.shopId}/basic_shifts`;
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
   * Delete BasicShift
   * @param shopId
   * @param BasicShiftId
   */
  deleteBasicShift(shopId: string, BasicShiftId: string) {
    const url = `${this.apiUrl}shops/${shopId}/basic_shifts/${BasicShiftId}`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
