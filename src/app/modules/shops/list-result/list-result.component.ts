import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, FileDownloadService} from 'src/app/core/services';
import {ConditionalSearchService} from 'src/app/core/services/apis/conditional-search.service';
import {Helper} from 'src/app/core/utils/helper';

/**
 * ListResultComponent
 * 結果コンポーネントのリスト
 */

@Component({
  selector: 'app-list-result',
  templateUrl: './list-result.component.html',
  styleUrls: ['./list-result.component.scss']
})

export class ListResultComponent implements OnInit {
  public urlImage = 'http://192.168.0.32:8000/';
  public countCustomer: any;
  public sexs = ['男性', '女性']
  public idInput: any;
  public data=[];
  public userLogin: any;
  public listResult;

  constructor(
    private router: Router,
    private searchService: ConditionalSearchService,
    private authService: AuthService,
    private fileDownloadService: FileDownloadService
  ) {
   
  }

  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    if (this.searchService.listResult.length>0) {
      this.data = this.searchService.listResult;
    }
      if (this.data) {
        this.data = this.formatList();
      }

      this.countCustomer = this.data.length;
    
  }

  /**
   * CSVをエクスポート
   */
 async  exportCSV() :Promise<void>{
    let data =  await this.searchService.exportCSV(this.searchService.listResult,this.userLogin.shop_id).toPromise();
    this.fileDownloadService.downloadExcel(data, '条件検索');
     data =  await this.searchService.exportCSV2(this.searchService.listResult,this.userLogin.shop_id).toPromise();
    this.fileDownloadService.downloadExcel(data, '精算情報出力');
  }

  backToSearch() {
    this.router.navigate(['shops/conditional-search']);
  }

  /**
   * フォーマットリスト
   */
  formatList(): any[] {
    let listData = [];
    this.data.forEach(element => {
      let item = element;
      // item['customer_img'] = this.urlImage + element['customer_img'];
      item['count_visit'] = '0';
      if (!element['t_reservations'] || element['t_reservations'].length < 1) {
        item['count_visit'] = '0';
      } else {
        if (element['t_reservations'] && element['t_reservations'].length > 0) {
          let count_visit = 0;
          element['t_reservations'].forEach(item4 => {
            if (Number(item4['visit_flg']) == 1) {
              count_visit++;
            }
           
          });
         
          item['count_visit'] = count_visit;
        }
      }
      item['totalPrice'] = Helper.formatCurrency(item['totalSale']);
      item['age'] = (new Date()).getFullYear() - new Date(Date.parse(item['birthday'])).getFullYear();
      listData.push(item);
    });
    return listData;
  }
  toSendMail(){
    this.router.navigateByUrl('shops/send-mail');
  }
}
