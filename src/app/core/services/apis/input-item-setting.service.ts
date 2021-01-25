import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { InputItemSetting } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class InputItemSettingService extends HttpService {
  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staft list
   * @param shopId
   */
  getInputItemSettingList(shopId: string): Observable<InputItemSetting[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_customer_infomation`;
    return this.http.get<InputItemSetting[]>(url).pipe(
      map((res) => {
        if (res) {
          return res;
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Create InputItemSettings
   * @param shopId
   * @param obj
   */
  createInputItemSetting(
    shopId: string,
    obj: InputItemSetting[]
  ): Observable<InputItemSetting[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_customer_infomation`;
    return this.http
      .post<InputItemSetting[]>(url, obj)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * Get InputItemSettings
   * @param shopId
   * @param InputItemSettingsId
   */
  getInputItemSetting(
    shopId: string,
    InputItemSettingId: string
  ): Observable<InputItemSetting[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_customer_infomation/${InputItemSettingId}`;
    return this.http.get<InputItemSetting[]>(url).pipe(
      map((res) => {
        if (res) {
          return res;
        }
      }),
      catchError((err) => this.handleError(err))
    );
  }

  /**
   * Update InputItemSettings
   * @param shopId
   * @param InputItemSettingsId
   * @param obj
   */
  updateInputItemSettings(
    shopId: string,
    obj: InputItemSetting[]
  ): Observable<InputItemSetting[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_customer_infomation`;
    return this.http
      .put<InputItemSetting[]>(url, obj)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * Delete InputItemSettings
   * @param shopId
   * @param InputItemSettingsId
   */
  deleteInputItemSettings(shopId: string, InputItemSettingId: string) {
    const url = `${this.apiUrl}shops/${shopId}/shop_customer_infomation/${InputItemSettingId}`;
    return this.http
      .delete(url)
      .pipe(catchError((err) => this.handleError(err)));
  }
}
