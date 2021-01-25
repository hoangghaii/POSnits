import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { StaffShift } from 'src/app/core/models';
import { HttpService } from '../http.service';


@Injectable({
  providedIn: 'root'
})

export class StaffShiftService extends HttpService {

  private apiUrl = env.BASE_URL + 'shops';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staff shift list
   *
   * @param {String} shopId
   * @param {String} staffId
   * @param {String} month
   *
   * @return {Observable<StaffShift[]>}
   */
  getStaffShiftList(shopId: number, staffId: string, month: string): Observable<StaffShift[]> {
    const staffShiftParrams = {shopId: String(shopId), staff_id: staffId, month: month};
    return this.http.get<StaffShift[]>(this.apiUrl + '/' + shopId + '/staff_shifts', {params: staffShiftParrams}).pipe(
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
   * Update staff shift list
   *
   * @param {String} shopId
   * @param {String} staffId
   * @param {String} month
   * @param {StaffShift} object[]
   *
   * @return {Observable<StaffShift>}
   */
  updateStaffShiftList(shopId: number, staffId: string, month: string, staffShift: object[]): Observable<StaffShift> {
    const staffShiftParrams = {staff_id: staffId, month: month};
    return this.http.put<StaffShift>(this.apiUrl + '/' + shopId + '/staff_shifts', staffShift, {params: staffShiftParrams}).pipe(
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
   * Create staff shift list
   *
   * @param {String} shopId
   * @param {String} staffId
   * @param {String} month
   * @param {StaffShift} object[]
   *
   * @return {Observable<StaffShift>}
   */
  createStaffShiftList(shopId: number, staffId: string, month: string, staffShift: object[]): Observable<StaffShift> {
    const staffShiftParrams = {staff_id: staffId, month: month};
    return this.http.post<StaffShift>(this.apiUrl + '/' + shopId + '/staff_shifts', staffShift, {params: staffShiftParrams}).pipe(
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
   * Delete staff shift list
   *
   * @param {String} shopId
   * @param {String} staffId
   * @param {String} month
   * @param {StaffShift} staffShift
   *
   * @return {Observable<StaffShift>}
   */
  deleteStaffShiftList(shopId: number, staffId: string, month: string): Observable<StaffShift> {
    const staffShiftParrams = {shopId: String(shopId), staff_id: staffId, month: month};
    return this.http.delete<StaffShift>(this.apiUrl + '/' + shopId + '/staff_shifts', {params: staffShiftParrams}).pipe(
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
