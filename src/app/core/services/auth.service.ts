import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {environment as env} from 'src/environments/environment';
import {LocalStorageService} from './local-storage.service';
import {GlobalConst} from 'src/app/constants/global-const';
import {Observable} from 'rxjs/internal/Observable';
import {of, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends HttpService {
  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService) {
    super();
  }

  /**
   * Login
   *
   * @param {Object} The email & password
   *
   * @return {Object}
   */
  login(user): Observable<any> {
    return this.http.post(this.apiUrl + 'login', user).pipe(
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
   * ログインユーザー情報を取得する
   */
  getCurrentUser(): Observable<any> {
    // If has logging
    const currentUser = this.localStorageService.getItem(GlobalConst.LocalStorageKeyMapping.currentUser);
    if (currentUser !== undefined && currentUser != null) {
      return of(currentUser);
    }

    return this.http.get(this.apiUrl + 'getUser').pipe(
      map((res: any) => {
        if (res) {
          this.localStorageService.setItem(GlobalConst.LocalStorageKeyMapping.currentUser, res);
        }
        return res;
      }),
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }

  /**
   * Get shop ID
   */
  async getShopId(): Promise<void> {
    // If has logging
    let user = this.localStorageService.getItem(GlobalConst.LocalStorageKeyMapping.currentUser);
    if (!user) {
      user = await this.getCurrentUser();
    }

    return user.shop_id;
  }

  /**
   * ログアウト
   */
  logOut(): Observable<any> {
    return this.http.get(this.apiUrl + 'logout').pipe(
      map((res: any) => {
        if (res) {
          this.localStorageService.clearAll();
          return res;
        }
      }),
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }

  /**
   * The user authenticated
   *
   * @return {boolean}
   */
  public isAuthenticated(): boolean {
    const token = this.localStorageService.getItem(GlobalConst.LocalStorageKeyMapping.token);

    if (token) {
      return true;
    }

    return false;
  }
}
