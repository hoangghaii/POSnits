import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {environment as env} from 'src/environments/environment';
import {HttpService} from '../http.service';
import {Tech} from 'src/app/core/models';

@Injectable({
  providedIn: 'root',
})
export class TechService extends HttpService {
  apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * スキルリストを取得する
   *
   * @param {String | Number} shopId
   * @param {String} categoryCd
   *
   * @return {Observable}
   */
  getSkillList(shopId: string, categoryCd: string): Observable<Tech[]> {
    const url = this.apiUrl + `shops/${shopId}/skills`;
    const params = new HttpParams().set('category_cd', categoryCd);
    const options = {params};
    return this.http.get<Tech[]>(url, options).pipe(
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
   * Get skill has skill_id = skillId
   *
   * @param {String} shopId
   * @param {String} skillId
   *
   * @return {Observable<Tech[]>}
   */
  getSkill(shopId: string, skillId: string): Observable<Tech[]> {
    const url = this.apiUrl + `shops/${shopId}/skills/${skillId}`;
    return this.http.get<Tech[]>(url).pipe(
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
   * Add new skill
   *
   * @param {Object} objTech
   *
   * @return {Observable}
   */
  createSkill(shopId: string, objTech: Tech): Observable<Tech[]> {
    const url = this.apiUrl + `shops/${shopId}/skills`;
    return this.http
      .post<Tech[]>(url, objTech)
      .pipe(
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
   * Update skill
   *
   * @param {String} shopId
   * @param {String} classId
   * @param {Object} objTech
   *
   * @return {Observable}
   */
  updateSkill(shopId: string, classId: string, objTech: Tech): Observable<Tech[]> {
    const url = this.apiUrl + `shops/${shopId}/skills/${classId}`;
    return this.http.put<Tech[]>(url, objTech)
      .pipe(
        catchError((e) => {
          return this.handleError(e);
        })
      );
  }

  /**
   * Update list skills after sort
   *
   * @param {Object} objTech
   *
   * @return {Observable}
   */
  updateSortSkills(objTech: any): Observable<any> {
    const url = this.apiUrl + `shops/${objTech.shopId}/skills`;
    return this.http.put(url, objTech).pipe(
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
   * Delete item
   *
   * @param {String | Number} shopId
   * @param {String | Number} skillId
   *
   * @return {Observable}
   */
  deleteSkill(shopId: any, skillId: any): Observable<any> {
    const url = this.apiUrl + `shops/${shopId}/skills/${skillId}`;
    return this.http.delete(url).pipe(
      catchError((e) => {
        return this.handleError(e);
      })
    );
  }
}
