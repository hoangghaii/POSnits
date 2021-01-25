import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {environment as env} from 'src/environments/environment';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from '../http.service';
import { ShopConversionSettings } from '../../models/shop-conversion-settings.model';

@Injectable({
  providedIn: 'root'
})
export class ConversionSettingsService extends HttpService {
  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get shop_conversion list
   */
  getShopConversionList(shopId: string): Observable<ShopConversionSettings[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_conversios`;
    return this.http.get<ShopConversionSettings[]>(url).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Create shop_conversion
   */
  createShopConversion(shopId: string, obj: any): Observable<any> {
    const url = `${this.apiUrl}shops/${shopId}/shop_conversios`;
    return this.http.post<any[]>(url, obj).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Get shop_conversion
   */
  getShopConversion(shopId: string, shopConversionId: string): Observable<any[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_conversios/${shopConversionId}`;
    return this.http.get<any[]>(url).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Update shop_conversion
   */
  updateShopConversion(shopId: string, shopConversionId: string, obj: any): Observable<any> {
    const url = `${this.apiUrl}shops/${shopId}/shop_conversios/${shopConversionId}`;
    return this.http.put<any>(url, obj).pipe(
      map(res => {
        if (res) {
          return res;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Delete shop_conversion
   */
  deleteShopConversion(shopId: string, shopConversionId: string): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/shop_conversios/${shopConversionId}`;
    return this.http.delete<void>(url).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
