import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Staff} from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class StaffService extends HttpService {
  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staffs
   *
   * @param {String} shopId
   *
   * @return {Observable}
   */
  getStaffList(shopId: string): Observable<Staff[]> {
    const url = `${this.apiUrl}shops/${shopId}/staffs`;
    return this.http.get<Staff[]>(url)
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
   * Create staff
   *
   * @param {String} shopId
   * @param {Object} objStaff
   *
   * @return {Observable}
   */
  createStaff(shopId: string, objStaff: Staff): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/staffs`;
    return this.http.post<void>(url, objStaff)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get staff
   *
   * @param {String} shopId
   * @param {String} staffId
   *
   * @return {Observable}
   */
  getStaff(shopId: string, staffId: string): Observable<Staff[]> {
    const url = `${this.apiUrl}shops/${shopId}/staffs/${staffId}`;
    return this.http.get<Staff[]>(url)
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
   * Update staff
   *
   * @param {String} shopId
   * @param {String} staffId
   * @param {String} objStaff
   *
   * @return {Observable}
   */
  updateStaff(shopId: string, staffId: string, objStaff: Staff): Observable<any> {
    const url = `${this.apiUrl}shops/${shopId}/staffs/${staffId}`;
    return this.http.put(url, objStaff)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete Staff
   *
   * @param {String} shopId
   * @param {String} staffId
   *
   * @return {Observable}
   */
  deleteStaff(shopId: string, staffId: string): Observable<any> {
    const url = `${this.apiUrl}shops/${shopId}/staffs/${staffId}`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Update staffs
   *
   * @param {Object} staff
   *
   * @return {Observable}
   */
  updateStaffs(staff): Observable<Staff[]> {
    const url = this.apiUrl + `shops/${staff.shopId}/staffs`;
    return this.http.put(url, staff).pipe(
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
