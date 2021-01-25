import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {Equipment} from 'src/app/core/models';
import {HttpService} from '../http.service';
@Injectable({
  providedIn: 'root'
})
export class EquipmentService extends HttpService {

  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staft list
   * @param shopId
   */
  getEquipmentList(shopId: string): Observable<Equipment[]> {
    const url = `${this.apiUrl}shops/${shopId}/equipments`;
    return this.http.get<Equipment[]>(url)
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
   * Create Equipment
   * @param shopId
   * @param obj
   */
  createEquipment(shopId: string, obj: Equipment[]): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/equipments`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get Equipment
   * @param shopId
   * @param EquipmentId
   */
  getEquipment(shopId: string, EquipmentId: string): Observable<Equipment[]> {
    const url = `${this.apiUrl}shops/${shopId}/equipments/${EquipmentId}`;
    return this.http.get<Equipment[]>(url)
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
   * Update equipment
   *
   * @param {Object} equipment
   *
   * @return {Observable}
   */
  updateEquipmentListSort(item): Observable<Equipment[]> {
    const url = this.apiUrl + `shops/${item.shopId}/equipments`;
    return this.http.put(url, item).pipe(
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
   * Update Equipment
   * @param shopId
   * @param EquipmentId
   * @param listEquipment
   */
  updateEquipment(shopId: string,obj:Equipment[],EquipmentId: string) {
    const url = `${this.apiUrl}shops/${shopId}/equipments/${EquipmentId}`;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete Equipment
   * @param shopId
   * @param EquipmentId
   */
  deleteEquipment(shopId: string, EquipmentId: string) {
    const url = `${this.apiUrl}shops/${shopId}/equipments/${EquipmentId}`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
