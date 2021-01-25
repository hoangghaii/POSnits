import {Component, OnInit} from '@angular/core';
import {TechClassification} from 'src/app/core/models';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Constants} from 'src/app/constants/constants';
import {TechClassificationService} from 'src/app/core/services/apis';
import {AuthService} from 'src/app/core/services';
import {ActivatedRoute} from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-item-classes',
  templateUrl: './item-classes.component.html',
  styleUrls: ['./item-classes.component.scss']
})
export class ItemClassesComponent implements OnInit {
  public status = false;
  public productClassificationList: TechClassification[];
  public productClassificationForm: FormGroup;
  public submitted = false;
  public arrList = [];
  public categoryCd = Constants.categoryClass.PRODUCT;

  public isConfirm = false;
  public isConfirmDlt: boolean;
  public isOpenDialog: boolean;
  public apiMessage: string = '';
  public mode: string = '';
  public isDelete: boolean;

  /**
   * current user login
   */
  userLogin: any;
  selectCurrent: any;

  /**
   * Open modal
   */
  open = false;
  statusOpen = null;

  /**
   * コンストラクタ
   * @param techClassificationService
   * @param authService
   * @param route
   * @param fb
   */
  constructor(
    private techClassificationService: TechClassificationService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.isConfirmDlt = false;
    this.isOpenDialog = false;
    this.productClassificationList = await this.getClasses();
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.productClassificationList,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.productClassificationList.length; i++) {
      this.productClassificationList[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 商品分類一覧を取得する
   */
  updateSortIndex(): void {
    let body = {
      shopId: this.userLogin.shopId,
      list: JSON.stringify(this.productClassificationList),
      categoryCd: this.categoryCd,
    };
    this.techClassificationService
      .updateSortIndex(this.userLogin.shopId, body)
      .subscribe((rs) => {
        this.getClasses();
      });
  }

  /**
   * 商品分類一覧を取得する
   */
  async getClasses(): Promise<any[]> {
    return await this.techClassificationService
      .getClasses(this.userLogin.shop_id, this.categoryCd)
      .toPromise();
  }

  /**
   * 商品分類フォームコントロールを取得する
   */
  get f() {
    return this.productClassificationForm.controls;
  }

  /**
   *レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.open = true;
  }

  /**
   * アイテムを選択
   * @param input
   */
  selectItem(input: TechClassification) {
    this.selectCurrent = input;
    this.openModal('update');
  }

  /**
   * モーダルを閉じる
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.productClassificationList = await this.getClasses();
    }
    this.open = event.open;
  }

  /**
   * Toggle big list
   */
  toggleBigList() {
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
