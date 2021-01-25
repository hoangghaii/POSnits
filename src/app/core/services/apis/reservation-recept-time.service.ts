import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { ReservationReceptTime } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})

export class ReservationReceptTimeService extends HttpService {
  apiUrl = env.BASE_URL + 'shops';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get reservation recept time
   *
   * @param {String} shopId
   *
   * @return {Observable<ReservationReceptTime[]>}
   */
  getReservationReceptTime(shopId: number): Observable<ReservationReceptTime[]> {
    return this.http.get<ReservationReceptTime[]>(this.apiUrl + '/' + shopId + '/reserv_recept_times').pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        if (e instanceof HttpErrorResponse) {
          return this.handleError(e);
        }
      })
    );
  }

  /**
   * Create reservation recept time
   *
   * @param {Object} reservReceptTime
   * @param {String} shopId
   *
   * @return {Observable<any>}
   */
  createReservationReceptTime(reservReceptTime: ReservationReceptTime, shopId: string): Observable<any> {
    return this.http.post(this.apiUrl + '/' + shopId + '/reserv_recept_times', reservReceptTime).pipe(
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
   * Update reservation recept time
   *
   * @param {String} shopId
   * @param {Object} reservReceptTime
   *
   * @return {Observable<any>}
   */
  updateReservationReceptTime(shopId: string, reservReceptTime: ReservationReceptTime): Observable<any> {
    return this.http.put(this.apiUrl + '/' + shopId + '/reserv_recept_times', reservReceptTime).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Delete reservation recept time
   *
   * @param {String} shopId
   *
   * @return {Observable<any>}
   */
  deleteReservationReceptTime(shopId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + shopId + '/reserv_recept_times').pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
        catchError(err => this.handleError(err))
      );
  }
}
