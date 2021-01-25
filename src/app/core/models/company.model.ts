/**
 * 会社情報
 */
export class Company {
  /**
   *  会社名
   */
  name: string;

  /**
   * 郵便番号
   */
    // tslint:disable-next-line:variable-name
  postal_cd: string;
  /**
   * 都道府県
   */
  prefecture: string;

  /**
   * 市町村
   */
  city: string;

  /**
   * 町域
   */
  area: string;

  /**
   * 番地
   */
  address: string;

  /**
   * 会計処理設定
   */
  accounting: string;

  /**
   * 締め日
   */
    // tslint:disable-next-line:variable-name
  cutoff_date: string;

  // tslint:disable-next-line:variable-name
  updated_at: any;
}
