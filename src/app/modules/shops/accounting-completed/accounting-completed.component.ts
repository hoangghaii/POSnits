import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constants/constants';
import { AuthService,} from 'src/app/core/services';
import { Helper } from 'src/app/core/utils/helper';
import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';
import { ReceiptsService } from 'src/app/core/services/apis/receipts.service';
qz.api.setSha256Type(data => sha256(data));
qz.api.setPromiseType(resolver => new Promise(resolver));
@Component({
  selector: 'app-accounting-completed',
  templateUrl: './accounting-completed.component.html',
  styleUrls: ['./accounting-completed.component.scss']
})
export class AccountingCompletedComponent implements OnInit {
  /**
   * Current user
   */
  userLogin: any;

  /**
   * Info
   */
  customerInfo: any;

  /**
   * First visit date
   */
  firstVisitDate = new Date();

  /**
   * Constant
   */
  helper = Helper;
  gender = Constants;

  /**
   * Open Popup
   */
  open = false;

  objInfo: any;

  constructor(
    private router: Router,
    private authService: AuthService,
    private receiptsService: ReceiptsService) { }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.objInfo = await JSON.parse(localStorage.getItem('objLS'));
  }

  /**
   * おつり TOPへ遷移
   */
  btnChange(): void {
    this.router.navigate(['/top']);
  }

  /**
   * Print and send mail
   */
  receiptPrinting(): void {
    qz.websocket.connect().then(async () => {
      return await qz.printers.find();  // name: Microsoft Print to PDF;
    }).then(async (printers) => {
      const file = await this.receiptsService.createReceipts(String(this.userLogin.shop_id), String(this.objInfo.saleId), '0', '1')
        .toPromise();
      const config = qz.configs.create('PDF');
      return qz.print(config, [{
        type: 'pdf',
        data: file[0]
      }]);
    }).then((res) => {
      this.open = false;
      return qz.websocket.disconnect();
    }).catch((err) => {
      this.open = false;
      if (err) {
        this.receiptsService.createReceipts(String(this.userLogin.shop_id), String(this.objInfo.saleId), '1', '1')
          .toPromise();
      }
      return qz.websocket.disconnect();
    });
  }

  /**
   * Open modal
   */
  openModal(): void {
    this.open = true;
  }

  /**
   * Get full name
   */
  getFullName(): string {
    return `${this.customerInfo.firstname} ${this.customerInfo?.lastname}`;
  }

  /**
   * Send mail
   */
  async sendMail(): Promise<void> {
    this.open = false;
    await this.receiptsService.createReceipts(String(this.userLogin.shop_id), String(1), String(this.objInfo.saleId), '1').toPromise();
  }
}
