import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {StaffRecept} from 'src/app/core/models';
import {HttpService} from '../http.service';


@Injectable({
  providedIn: 'root'
})

export class StaffReceptService extends HttpService {

  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staft list
   * @param shopId
   */
  getStaffReceptsList(shopId: string): Observable<StaffRecept[]> {
    const url = `${this.apiUrl}shops/${shopId}/staff_recepts`;
    return this.http.get<StaffRecept[]>(url)
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
   * Create StaffRecepts
   * @param shopId
   * @param obj
   */
  createStaffRecepts(shopId: string, obj: any): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/staff_recepts`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get StaffRecepts
   * @param shopId
   * @param StaffReceptsId
   */
  getStaffRecepts(shopId: string, StaffReceptsId: string): Observable<StaffRecept[]> {
    const url = `${this.apiUrl}shops/${shopId}/staff_recepts/${StaffReceptsId}`;
    return this.http.get<StaffRecept[]>(url)
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
   * Update StaffRecepts
   * @param shopId
   * @param StaffReceptsId
   * @param obj
   */
  updateStaffRecepts(shopId: string, obj: any) {
    const url = `${this.apiUrl}shops/${shopId}/staff_recepts`;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete StaffRecepts
   * @param shopId
   * @param StaffReceptsId
   */
  deleteStaffRecepts(shopId: string, StaffReceptsId: string) {
    const url = `${this.apiUrl}shops/${shopId}/staff_recepts/${StaffReceptsId}`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
