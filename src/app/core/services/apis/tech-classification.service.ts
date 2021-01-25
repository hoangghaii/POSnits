import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {TechClassification} from '../../models';

@Injectable({
  providedIn: 'root',
})
/**
 * TechClassificationService
 * 分類情報サービス
 */
export class TechClassificationService {
  baseUrl = environment.BASE_URL;

  /**
   * コンストラクタ
   */
  constructor(private http: HttpClient, private httpService: HttpService) {
  }

  /**
   * 分類情報一覧を取得する
   * parameterのshopIdでDB「分類情報(m_classes)」を取得する
   * @param shopId
   */
  getClassesList(
    shopId: string
  ): Observable<TechClassification[]> {
    const url = this.baseUrl + `shops/${shopId}/classes`;
    return this.http
      .get<TechClassification[]>(url)
      .pipe(
        tap(),
        catchError((e) => {
          return this.httpService.handleError(e);
        })
      );
  }

  /**
   * 分類情報一覧を取得する
   * parameterのshopIdでDB「分類情報(m_classes)」を取得する
   * @param shopId
   */
  getClasses(
    shopId: string,
    categoryCd: string
  ): Observable<TechClassification[]> {
    const url = this.baseUrl + `shops/${shopId}/classes`;
    let params = new HttpParams().set('category_cd', categoryCd);
    return this.http
      .get<TechClassification[]>(url, {params: params})
      .pipe(
        tap(),
        catchError((e) => {
          return this.httpService.handleError(e);
        })
      );
  }

  /**
   * 分類情報を取得する
   * parameterのshopIdでDB「分類情報(m_classes)」を取得する。
   * @param shopId
   * @param classId
   */
  getClass(shopId: string, classId: string): Observable<TechClassification[]> {
    const url = this.baseUrl + `shops/${shopId}/classes/${classId}`;
    return this.http.get<TechClassification[]>(url).pipe(
      tap(),
      catchError((e) => {
        return this.httpService.handleError(e);
      })
    );
  }

  /**
   * 分類情報を登録する。
   * REQUEST BODY SCHEMAの情報でDB「分類情報(m_classes」へ登録する。
   * @param body  分類情報
   */
  createClass(shopId: string, obj: TechClassification) {
    const url = this.baseUrl + `shops/${shopId}/classes`;
    return this.http.post(url, obj).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        return this.httpService.handleError(e);
      })
    );
  }

  /**
   * パラメータのclassIdの分類情報を更新する。
   * parameterのshopId, classIdで、REQUEST BODY SCHEMAの情報でDB「分類情報(m_classes)」へ更新する。
   * @param body 分類情報
   */
  updateClass(shopId: string, classId: string, obj: TechClassification) {
    const url = this.baseUrl + `shops/${shopId}/classes/${classId}`;
    return this.http.put(url, obj).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        return this.httpService.handleError(e);
      })
    );
  }

  /**
   * パラメータのclassIdの分類情報を削除する。
   * parameterのshopId, classIdで、REQUEST BODY SCHEMAの情報でDB「分類情報(m_classes)」へ削除する。
   * @param body 分類情報
   */
  deleteClass(shopId: string, classId: string) {
    const url = this.baseUrl + `shops/${shopId}/classes/${classId}`;
    return this.http.delete(url, {}).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        return this.httpService.handleError(e);
      })
    );
  }

  /**
   * ソートIndexの更新を更新する。
   * parameterのshopIdで、REQUEST BODY SCHEMAの情報でDB「分類情報(m_classes)」へ更新する。
   * @param body 分類情報
   */
  updateSortIndex(shopId, body) {
    const url = this.baseUrl + `shops/${shopId}/classes`;
    return this.http.put(url, body).pipe(
      map((res: any) => {
        if (res) {
          return res;
        }
      }),
      catchError((e) => {
        return this.httpService.handleError(e);
      })
    );
  }
}
