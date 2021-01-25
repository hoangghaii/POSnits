import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { Reservation } from '../../models';
import { HttpService } from '../http.service';

@Injectable({
    providedIn: 'root'
})

export class ReservationService extends HttpService {
    apiUrl = env.BASE_URL + 'shops';

    constructor(private http: HttpClient) {
        super();
    }

    /**
     * Get reservation list
     *
     * @param {String} shopId
     * @param {String} month
     * @param {String} week
     * @param {String} day
     * @param {String} visit_flg
     *
     * @return {Observable<Reservation[]>}
     */
    getReservationList(shopId: string, month?: string, week?: string, day?: string, visit_flg?: string): Observable<Reservation[]> {
      const reservastionParrams = {month: month, week: week, day: day, visit_flg: visit_flg};
        return this.http.get<Reservation[]>(this.apiUrl + '/' + shopId + '/reservations', {params: reservastionParrams}).pipe(
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
        )
    }

    /**
     * Create reservation
     *
     * @param {String} shopId
     * @param {Object} reservation
     *
     * @return {Observable<any>}
     */
    createReservation(shopId: string, reservation: Reservation): Observable<any> {
        return this.http.post(this.apiUrl + '/' + shopId + '/reservations', reservation).pipe(
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
     * Get reservation
     *
     * @param {String} shopId
     * @param {String} reservationId
     *
     * @return {Observable<Reservation[]>}
     */
    getReservation(shopId: string, reservationId: string): Observable<Reservation> {
        return this.http.get<Reservation>(this.apiUrl + '/' + shopId + '/reservations/' + reservationId).pipe(
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
        )
    }

    /**
     * Update reservation
     *
     * @param {String} shopId
     * @param {Object} reservation
     *
     * @return {Observable<any>}
     */
    updateReservationReceptTime(shopId: string, reservation: Reservation[]): Observable<any> {
        return this.http.put(this.apiUrl + '/' + shopId + '/reservations/' + reservation[0].id, reservation).pipe(
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
     * Delete reservation
     *
     * @param {String} shopId
     * @param {String} reservationId
     *
     * @return {Observable<any>}
     */
    deleteReservationReceptTime(shopId: string, reservationId: string): Observable<any> {
        return this.http.delete(this.apiUrl + '/' + shopId + '/reservations/' + reservationId).pipe(
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
     * リストIDでリストメニューを取得
     * @param shopId 
     * @param list 
     */
    getListMenusByListId(shopId:string,list:string): Observable<any[]> {
        const reservastionParrams = {list: list};
          return this.http.get<any[]>(this.apiUrl + '/' + shopId + '/ListMenusByListId', {params: reservastionParrams}).pipe(
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
          )
      } 

}
