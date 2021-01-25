import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Observable} from 'rxjs/internal/Observable';
import {HttpErrorResponse} from '@angular/common/http';
import {Company} from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class CompanyService extends HttpService {
  private apiUrl = env.BASE_URL + 'companies';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Add company
   *
   * @param {Object} company
   *
   * @return {Observable<any>}
   */
  addCompany(company): Observable<any> {
    return this.http.post(this.apiUrl, company).pipe(
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
   * Get company
   *
   * @param {string} companyId
   *
   * @return {Observable<any>}
   */
  getCompany(companyId: string): Observable<Company> {
    return this.http.get<Company>(this.apiUrl + '/' + companyId).pipe(
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
   * 会社を更新
   *
   * @param {number} companyId
   *
   * @return Observable
   */
  updateCompany(companyId: string, obj: Company): Observable<any> {
    return this.http.put(this.apiUrl + '/' + companyId, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 会社を削除する
   *
   * @param {number} companyId
   *
   * @return Observable
   */
  deleteCompany(companyId: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + companyId)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * Get users
   *
   * @param {Number} companyId
   *
   * @return {Observable<any>}
   */
  getUsers(companyId): Observable<any> {
    return this.http.get(this.apiUrl + '/' + companyId + '/' + 'users').pipe(
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
   * Create user
   *
   * @param {Number} companyId
   * @param {Object} user
   *
   * @return {Observable<any>}
   */
  createUser(companyId, user): Observable<any> {
    return this.http.post(this.apiUrl + '/' + companyId + '/' + 'users', user).pipe(
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
   * Update user
   *
   * @param {Number} companyId
   * @param {Number} userId
   *
   * @return {Observable<any>}
   */
  getUser(companyId, userId): Observable<any> {
    return this.http.get(this.apiUrl + '/' + companyId + '/' + 'users' + '/' + userId).pipe(
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
   * Update user
   *
   * @param {Number} companyId
   * @param {Number} userId
   * @param {Object} user
   *
   * @return {Observable<any>}
   */
  updateUser(companyId, userId, user): Observable<any> {
    return this.http.post(this.apiUrl + '/' + companyId + '/' + 'users' + '/' + userId, user).pipe(
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
   * Delete user
   *
   * @param {Number} companyId
   * @param {Number} userId
   *
   * @return {Observable<any>}
   */
  deleteUser(companyId, userId): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + companyId + '/' + 'users' + '/' + userId)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
