import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Contract} from 'src/app/core/models';

@Injectable({
  providedIn: 'root'
})
export class ContractService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Get contract list
   *
   * @param {String} customerId
   *
   * @return {Observable}
   */
  getContractList(customerId: number): Observable<Contract[]> {
    const url = this.apiUrl + `customers/${customerId}/contract`;
    return this.http.get<Contract[]>(url).pipe(
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
   * @param {Object} item
   * @param {String} customerId
   *
   * @return {Observable}
   */
  createContract(item: Contract, customerId: string): Observable<any> {
    const url = this.apiUrl + `customers/${customerId}/contract`;
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
   * Get contract
   *
   * @param {String} customerId
   * @param {String} item
   *
   * @return {Observable}
   */
  getContract(customerId: string, contractId: string): Observable<Contract> {
    const url = this.apiUrl + `customers/${customerId}/contract/${contractId}`;
    return this.http.get<Contract>(url).pipe(
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
   * @param {String} customerId
   * @param {Object} item
   *
   * @return {Observable}
   */
  updateContract(customerId: string, item: Contract[]): Observable<Contract> {
    const url = this.apiUrl + `customers/${customerId}/contract/${item[0].id}`;
    return this.http.put<Contract>(url, item).pipe(
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
   * @param {String} customerId
   * @param {String} itemId
   *
   * @return {Observable}
   */
  deleteContract(customerId: string, itemId: string): Observable<Contract> {
    const url = this.apiUrl + `customers/${customerId}/contract/${itemId}`;
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
