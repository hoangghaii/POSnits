import {Component, OnInit} from '@angular/core';
import {CoursesClassification} from '../../../core/models';
import {Constants} from '../../../constants/constants';
import {CouponMenuService, TechClassificationService} from '../../../core/services/apis';
import {AuthService} from '../../../core/services';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {
  public courseClassificationList: CoursesClassification[];
  public isOpen: boolean;
  public categoryCd = Constants.categoryClass.COURSE;
  public selectCurrent: any;
  public userLogin: any;
  coupons = [];

  /**
   * コンストラクタ
   * @param techClassificationService
   * @param authService
   */
  constructor(
    private couponMenuService: CouponMenuService,
    private authService: AuthService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.getCoupons();
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.isOpen = true;
  }

  /**
   * モーダルを閉じる
   */
  async closeModal(event: any): Promise<void> {
    this.selectCurrent = null;
    if (event && event.isReload === true) {
      await this.getCoupons();
    }
    this.isOpen = event.isOpen;
  }

  /**
   * 分類情報一覧を取得する
   */
  async getCoupons(): Promise<any> {
    this.coupons = await this.couponMenuService
      .getCouponMenus(this.userLogin.shop_id)
      .toPromise();
  }

  /**
   * モーダルを開く。
   */
  selectedRow(select: CoursesClassification): void {
    this.selectCurrent = select;
    this.isOpen = true;
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.coupons,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.coupons.length; i++) {
      this.coupons[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 分類情報一覧を取得する
   */
  updateSortIndex(): void {
    const body = {
      shopId: this.userLogin.shop_id,
      list: this.coupons
    };
    this.couponMenuService
      .updateSortCoupon(this.userLogin.shop_id, body)
      .subscribe(
        (rs) => {
          this.coupons = rs;
        });
  }

  /**
   * Toggle big list
   */
  toggleBigList(): void {
    const toggle = document.getElementById('toggle-bigList');
    const btnToggle = document.getElementById('btn-toggle-bigList');
    if (toggle.hasAttribute('open')) {
      toggle.removeAttribute('open');
      toggle.classList.remove('animation');
      btnToggle.classList.toggle('animation');
    } else {
      toggle.setAttribute('open', '');
      toggle.classList.toggle('animation');
      btnToggle.classList.toggle('animation');
    }
  }
}
