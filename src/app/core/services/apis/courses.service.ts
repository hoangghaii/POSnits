import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpParams,
} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Courses} from 'src/app/core/models/courses.model';

@Injectable({
  providedIn: 'root',
})
/**
 * CoursesService
 * コースサービス
 */
export class CoursesService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * コースリストを取得する
   *
   * @param {string} shopId
   * @param {string} categoryCd
   *
   * @return {Observable}
   */
  getCourseList(shopId: string, categoryCd: string): Observable<Courses[]> {
    const url = `${this.apiUrl}shops/${shopId}/courses`;
    const params = new HttpParams().set('category_cd', categoryCd);
    const options = {params};
    return this.http.get<Courses[]>(url, options).pipe(
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
   * コースを取得
   * @param {Number | String} shopId
   * @param {Number | String} courseId
   *
   * @return {Observable}
   */
  getCourse(shopId: string, courseId: string): Observable<Courses[]> {
    const url = `${this.apiUrl}shops/${shopId}/courses/${courseId}`;
    return this.http.get<Courses[]>(url)
      .pipe(
        map(res => {
          if (res) {
            return res;
          }
        }),
        catchError(err => this.handleError(err))
      );
  }

  /**
   * コースを作成する
   *
   * @param {Number | String} shopId
   * @param {Object} objCourse
   *
   * @return {Observable}
   */
  createCourse(shopId: string, objCourse: Courses): Observable<void> {
    const url = `${this.apiUrl}shops/${shopId}/courses`;
    return this.http.post<void>(url, objCourse)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }


  /**
   * Update course
   *
   * @param {Number | String} shopId
   * @param {Number | String} courseId
   * @param {Object} objCourse
   *
   * @return {Observable}
   */
  updateCourse(shopId: string, courseId: string, objCourse: Courses): Observable<any> {
    const url = `${this.apiUrl}shops/${shopId}/courses/${courseId}`;
    return this.http.put(url, objCourse)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }

  /**
   * 並べ替えコースを更新する
   *
   * @param {Object} objCourse
   *
   * @return {Observable}
   */
  updateSortCourses(objCourse: any): Observable<any> {
    const url = `${this.apiUrl}shops/${objCourse.shopId}/courses`;
    return this.http.put(url, objCourse).pipe(
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
   * コースを削除する
   *
   * @param {Number | String} shopId
   * @param {Number | String} courseId
   *
   * @return {Observable}
   */
  deleteCourse(shopId: any, courseId: any): Observable<any> {
    const url = `${this.apiUrl}shops/${shopId}/courses/${courseId}`;
    return this.http.delete(url)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
