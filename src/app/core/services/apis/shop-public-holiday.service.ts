import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { HolidaySetting } from 'src/app/core/models';
import { HttpService } from 'src/app/core/services/http.service';

@Injectable({
  providedIn: 'root'
})
export class ShopPublicHolidayService extends HttpService {
  private apiUrl = env.BASE_URL;
  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Create shop_public_holiday
   * @param shopId
   * @param obj
   */
  createShopPublicHoliday(shopId: string, obj: HolidaySetting[]): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/shop_public_holidaies`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get shop_public_holiday
   * @param shopId
   * @param holidayId
   */
  getShopPublicHoliday(shopId: string): Observable<HolidaySetting[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_public_holidaies`;
    return this.http.get<HolidaySetting[]>(url)
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
   * Update shop_public_holiday
   * @param shopId
   * @param holidayId
   * @param obj
   */
  updateShopPublicHoliday(shopId: string, obj: HolidaySetting[]) {
    const url = `${this.apiUrl}shops/${shopId}/shop_public_holidaies`;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete shop_public_holiday
   * @param shopId
   * @param holidayId
   */
  deleteShopPublicHoliday(shopId: string) {
    const url = `${this.apiUrl}shops/${shopId}/shop_public_holidaies`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
