import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from './http.service';

/**
 * ファイルアップロードAPIコール
 */
@Injectable({
  providedIn: 'root'
})
export class UploadService extends HttpService {
  private apiUrl = env.BASE_URL + 'uploads';

  constructor(private http: HttpClient) {
    super();
  }

  /**
   * ファイルアップロード
   *
   * @param fileList fileインプットのfiles属性
   *
   * @return ファイルID(一時領域にアップロードされたファイル)
   */
  upload(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(this.apiUrl, formData).pipe(
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
