import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EquipmentMenu } from 'src/app/core/models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class EquipmentMenuService extends HttpService {
  baseUrl = environment.BASE_URL;
  constructor(
    private http: HttpClient,
    ) {
      super();
     }

  /**
   * Get equipment_menu list
   * @param equipmentId
   */
  getEquipmentMenuList(equipmentId: number): Observable<any[]>{
    const url = this.baseUrl + `equipment/${equipmentId}/equipment_menus`;
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
   * Get equipment_menu list
   * @param equipmentMenuId
   */
  getEquipmentMenuListByMenuId(equipmentMenuId : number): Observable<any[]>{
    const url = this.baseUrl + `equipment_menus/${equipmentMenuId}/equipments`;
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
   * Get equipment_menu list
   * @param equipmentMenuId
   */
  getEquipmentMenuListByMenuIdArray(equipmentMenuId): Observable<any[]>{
    const url = this.baseUrl + `equipment_menus/list_equipment_menus/equipment`;
    let params = new HttpParams().set('list', equipmentMenuId);
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
   * Get equipment_menu
   * @param equipmentId
   * @param equipmentMenuId
   */
  getEquipmentMenu(equipmentId: number, equipmentMenuId: number): Observable<EquipmentMenu>{
    const url = this.baseUrl + `equipment/${equipmentId}/equipment_menus/${equipmentMenuId}`;
    return this.http.get<EquipmentMenu>(url).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Create equipment_menu
   * @param equipmentId
   * @param equipmentMenu
   */
  createEquipmentMenu(equipmentId: number, equipmentMenu: EquipmentMenu[]): Observable<void> {
    const url = this.baseUrl + `equipment/${equipmentId}/equipment_menus`;
    return this.http.post<void>(url, equipmentMenu).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Update equipment_menu
   * @param equipmentId
   * @param equipmentMenu
   */
  updateEquipmentMenu(equipmentId: number, equipmentMenu: EquipmentMenu): Observable<void>{
    const url = this.baseUrl + `equipment/${equipmentId}/equipment_menus/${equipmentMenu.id}`;
    return this.http.put<void>(url, equipmentMenu).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Delete equipment_menu
   * @param equipmentId
   * @param equipmentMenuId
   */
  deleteEquipmentMenu(equipmentId: number, equipmentMenuId: number){
    const url = this.baseUrl + `equipment/${equipmentId}/equipment_menus/${equipmentMenuId}`;
    return this.http.delete(url).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
