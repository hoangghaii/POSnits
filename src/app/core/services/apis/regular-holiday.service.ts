import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {RegularHoliday} from 'src/app/core/models';
import {HttpService} from '../http.service';


@Injectable({
  providedIn: 'root'
})
export class RegularHolidayService extends HttpService {

  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get staft list
   * @param shopId
   */
  getRegularHolidayList(shopId: string): Observable<RegularHoliday[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_holidaies`;
    return this.http.get<RegularHoliday[]>(url)
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
   * Create RegularHoliday
   * @param shopId
   * @param obj
   */
  createRegularHoliday(shopId: string, obj: any): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/shop_holidaies`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get RegularHoliday
   * @param shopId
   * @param RegularHolidayId
   */
  getRegularHoliday(shopId: string, RegularHolidayId: string): Observable<RegularHoliday[]> {
    const url = `${this.apiUrl}shops/${shopId}/shop_holidaies/${RegularHolidayId}`;
    return this.http.get<RegularHoliday[]>(url)
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
   * Update RegularHoliday
   * @param shopId
   * @param RegularHolidayId
   * @param obj
   */
  updateRegularHoliday(shopId: string, obj: any) {
    const url = `${this.apiUrl}shops/${shopId}/shop_holidaies`;
    return this.http.put(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete RegularHoliday
   * @param shopId
   * @param RegularHolidayId
   */
  deleteRegularHoliday(shopId: string, RegularHolidayId: string) {
    const url = `${this.apiUrl}shops/${shopId}/shop_holidaies/${RegularHolidayId}`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}

