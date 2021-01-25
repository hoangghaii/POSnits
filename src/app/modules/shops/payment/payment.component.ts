import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { PaymentService } from 'src/app/core/services/apis';

/**
 * PaymentComponent
 * 支払いコンポーネント
 */
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  public submitted = false;
  public userLogin: any;
  public listPayments: any[];
  public listPaymentsFilter: any[];
  public open: boolean;
  public selectCurrent: any;
  public default = '現金';

  /**
   * コンストラクタ
   * @param paymentService
   * @param authService
   */
  constructor(
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listPayments = await this.getListPayment();
    this.open = false;
  }

  /**
   * リスト支払いを取得する
   */
  async getListPayment(): Promise<any[]> {
    return await this.paymentService
      .getListPayment(this.userLogin.shop_id)
      .toPromise();
  }

  /**
   * 支払いを追加
   */
  addPayment() {}

  /**
   * レジスターを開く
   */
  openModal(status?: string) {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.open = true;
  }

  /**
   * モーダルを閉じる
   * @param event
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.listPayments = await this.getListPayment();
    }
    this.open = event.open;
  }

  /**
   * 選択した行
   * @param input
   */
  selectedRow(input) {
    this.selectCurrent = input;
    this.openModal('update');
  }

  /**
   * ドロップリストを処理する
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listPayments, event.previousIndex, event.currentIndex);
    this.updateSortItems();
  }

  /**
   * 並べ替えアイテムを更新
   */
  updateSortItems(): void {
    for (let i = 0; i < this.listPayments.length; i++) {
      this.listPayments[i].sort = i;
    }

    const obj = {
      shopId: this.userLogin.shop_id,
      list: JSON.stringify(this.listPayments),
    };

    // Update list equipment
    this.paymentService.updateListPayments(obj).subscribe(async (data) => {
      this.listPayments = await this.getListPayment();
    });
  }
}
