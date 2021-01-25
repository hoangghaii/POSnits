import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';
import { ReceptionSetting } from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})

export class ReceptionSettingService extends HttpService {
  apiUrl = environment.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get reserv_recept
   */
  getReceptionSetting(shopId: string): Observable<ReceptionSetting>{
    const url = this.apiUrl + `shops/${shopId}/reserv_recepts`;
    return this.http.get<ReceptionSetting>(url).pipe(
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
   * Create eserv_recept
   */
  createReceptionSetting(shopId: string, item: ReceptionSetting) {
    const url = this.apiUrl + `shops/${shopId}/reserv_recepts`;
    return this.http.post(url, item).pipe(
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
   * Update reserv_recept
   */
  updateReceptionSetting(shopId: string, item: ReceptionSetting) {
    const url = this.apiUrl + `shops/${shopId}/reserv_recepts`;
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
   * Delete reserv_recept
   */
  deleteReceptionSetting(shopId: string) {
    const url = this.apiUrl + `shops/${shopId}/reserv_recepts`;
    return this.http.delete(url).pipe(
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
