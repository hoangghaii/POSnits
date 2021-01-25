import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment as env } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service';
import { AutoMail } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class AutoMailService extends HttpService {
  private apiUrl = env.BASE_URL;

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * Create auto_mail
   * @param obj
   */
  createAutoMail(obj: AutoMail): Observable<void> {
    const url = `${this.apiUrl}auto_mails`;
    return this.http.post<void>(url, obj)
      .pipe(
        catchError(err => this.handleError(err))
      );
  }
}
