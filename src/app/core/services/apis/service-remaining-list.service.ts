import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {RerviceRemaining} from 'src/app/core/models';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root'
})

export class ServiceRemainingListService extends HttpService {
  baseUrl = env.BASE_URL + 'shops/';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get service remaining output
   *
   * @param {String} shopId
   * @param {Object} item
   *
   * @return Observable
   */
  getServiceRemainingList(shopId: string, item: RerviceRemaining): Observable<any> {
    const url = this.baseUrl + `${shopId}/service_remaining?target_from=${item.target_from}?target_to=${item.target_to}?target_type=${item.target_type}?staff_id=${item.staff_id}`;
    return this.http.get(url).pipe(
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
   * Get service remaining output
   *
   * @param {String} shopId
   * @param {Object} item
   *
   * @return Observable
   */
  getServiceRemainingOutput(shopId: string, item: RerviceRemaining): Observable<any> {
    const url = this.baseUrl + `${shopId}/service_remaining?target_from=${item.target_from}?target_to=${item.target_to}?target_type=${item.target_type}?staff_id=${item.staff_id}`;
    return this.http.post(url, item, {responseType: 'blob'}).pipe(
      map((res: Blob) => {
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
