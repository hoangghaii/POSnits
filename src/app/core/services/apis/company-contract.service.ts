import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyContractService extends HttpService {
  apiUrl = env.BASE_URL + 'company_contracts';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get Contracts
   *
   * @return {Observable<any>}
   */
  getContracts(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(
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
   * Create contract
   *
   * @param {Object} contract
   *
   * @return {Observable<any>}
   */
  createContract(contract): Observable<any> {
    return this.http.post(this.apiUrl, contract).pipe(
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
   * Update contract
   *
   * @param {Number} id
   *
   * @return {Observable<any>}
   */
  getContract(id): Observable<any> {
    return this.http.get(this.apiUrl + '/' + id).pipe(
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
   * Update contract
   *
   * @param {Number} id
   * @param {Object} contract
   *
   * @return {Observable<any>}
   */
  updateContract(id, contract): Observable<any> {
    return this.http.post(this.apiUrl + '/' + id, contract).pipe(
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
   * Delete contract
   *
   * @param {Number} id
   *
   * @return {Observable<any>}
   */
  deleteContract(id): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
