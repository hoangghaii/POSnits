import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { LocalStorageService, ModalService } from '../services';
import { GlobalConst } from 'src/app/constants/global-const';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

/**
 * HTTPレスポンスエラー捕捉用Interceptor
 */
@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(
      private localStorageService: LocalStorageService,
      private modalService: ModalService,
      private translate: TranslateService) {
  }

  /**
   * エラーが発生した際の処理
   *
   * @param request HTTPリクエスト情報
   * @param next HTTPハンドラー
   *
   * @return void
   */
  // tslint:disable-next-line: no-any
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token: string = this.localStorageService.getItem(GlobalConst.LocalStorageKeyMapping.token);
    const isApiUrl = request.url.startsWith(env.BASE_URL);
    const headers = (token && isApiUrl) ? {
      Authorization: `Bearer ${token}`
    } : {};

    request = request.clone({
      setHeaders: headers
    });

    return next.handle(request).pipe(
      map((evt: HttpEvent<any>) => {
        return evt;
      }),
      catchError((err: HttpErrorResponse) => {
        if (err.status === 500) {
          this.translate.get('msgError.SystemError').subscribe((msg) => {
            this.modalService.open(msg);
          });
        }
        if (err.status === 400) {
          this.modalService.open(err.error.message);
        }
        if (err.status === 422) {
          this.modalService.open(err.error.errors);
        }
        if (err.status === 401) {
          this.localStorageService.remove(GlobalConst.LocalStorageKeyMapping.token);
          this.translate.get('msgError.unAuthorizedError').subscribe((msg) => {
            this.modalService.open(msg);
          });
        }
        return throwError(err);
      })
    );
  }
}
