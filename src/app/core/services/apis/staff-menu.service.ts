import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StaffMenu } from 'src/app/core/models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class StaffMenuService extends HttpService {
  baseUrl = environment.BASE_URL;
  constructor(
    private http: HttpClient,
    ) {
      super();
     }

  /**
   * Get staff_menu list
   * @param staffId
   */
  getStaffMenuList(staffId: number): Observable<any[]>{
    const url = this.baseUrl + `staff/${staffId}/staff_menus`;
    return this.http.get<any[]>(url).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Get staff_menu list by menu-id
   * @param staffMenuId
   */
  getStaffMenuListByMenuId(staffMenuId : number): Observable<any[]>{
    const url = this.baseUrl + `staff_menus/${staffMenuId}/staff`;
    return this.http.get<any[]>(url).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Get staff_menu list by array menu-id
   * @param staffMenuIds
   */
  getStaffMenuListByMenuIdArray(staffMenuIds): Observable<any[]>{
    const url = this.baseUrl + `staff_menus/list_staff_menus/staff`;
    let params = new HttpParams().set('list', staffMenuIds);
    return this.http.get<any[]>(url, {params: params}).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Get staff_menu
   * @param staffId
   * @param staffMenuId
   */
  getStaffMenu(staffId: number, staffMenuId: number): Observable<StaffMenu>{
    const url = this.baseUrl + `staff/${staffId}/staff_menus/${staffMenuId}`;
    return this.http.get<StaffMenu>(url).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Create staff_menu
   * @param staffId
   * @param staffMenu
   */
  createStaffMenu(staffId: number, staffMenu: StaffMenu[]): Observable<void> {
    const url = this.baseUrl + `staff/${staffId}/staff_menus`;
    return this.http.post<void>(url, staffMenu).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Update staff_menu
   * @param staffId
   * @param staffMenu
   */
  updateStaffMenu(staffId: number, staffMenu: StaffMenu): Observable<void>{
    const url = this.baseUrl + `staff/${staffId}/staff_menus/${staffMenu.id}`;
    return this.http.put<void>(url, staffMenu).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Delete staff_menu
   * @param staffId
   * @param staffMenuId
   */
  deleteStaffMenu(staffId: number, staffMenuId: number){
    const url = this.baseUrl + `staff/${staffId}/staff_menus/${staffMenuId}`;
    return this.http.delete(url).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
