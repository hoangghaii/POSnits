import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';

import {Customer} from 'src/app/core/models';
import {HttpService} from '../http.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends HttpService {

  constructor(private http: HttpClient) {
    super();
  }

  private apiUrl = (shopId: string = '') => `${env.BASE_URL}shops/${shopId}/customers`;

  /**
   * get Customer list
   * @param shopId
   */
  getListCustomer(shopId: string): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl(shopId)).pipe(
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
   * search customer with condition
   * @param shopId
   * @param formCondition
   */
  getListCustomerWithCondition(shopId: string, formCondition): Observable<Customer[]> {
    const options = {params: formCondition.value};
    return this.http.get<Customer[]>(this.apiUrl(shopId), options).pipe(
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
   * create new customer
   * @param customer
   * @param shopId
   */
  createCustomer(customer: Customer, shopId: string) {
    return this.http.post(this.apiUrl(shopId), customer).pipe(
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
   * get customer info
   */
  getCustomer(shopId: string, customerId: string): Observable<Customer> {
    return this.http.get<Customer>(this.apiUrl(shopId) + '/' + customerId).pipe(
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
   * change info customer
   * @param shopId
   * @param customer
   */
  updateCustomer(shopId: string, customer: Customer): Observable<Customer> {
    const url = this.apiUrl(shopId) + '/' + customer.id;
    return this.http.put<Customer>(url, customer).pipe(
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
   * delete customer
   * @param shopId
   * @param customerId
   */
  deleteCustomer(shopId: string, customerId: number): Observable<Customer> {
    const url = this.apiUrl(shopId) + '/' + customerId;
    return this.http.delete(url, {}).pipe(
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
