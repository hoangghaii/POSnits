import { Component, OnInit } from '@angular/core';
import { Helper } from 'src/app/core/utils/helper';
import { Product, Tax, TechClassification } from 'src/app/core/models';
import { ProductService, TaxService, TechClassificationService, TechService } from 'src/app/core/services/apis';
import { AuthService } from 'src/app/core/services';
import { Constants } from 'src/app/constants/constants';
import { RegexValidator } from 'src/app/constants/global-const';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {
  public helper = Helper;
  public isDelete = false;
  public categoryCd = Constants.categoryClass.PRODUCT;
  public listItems: Product[];
  public listItemsFilter: Product[];
  public listClass: any[];
  public shopId = '';
  public listTaxes: Tax[];
  public submitted = false;
  public isConfirm: boolean;
  public isOpenDialog: boolean;
  public isEdit: boolean;
  public isCreate: boolean;
  public apiMessage: string;
  public isConfirmDlt: boolean;
  public status = false;
  public numberOnlyRegex: RegExp;

  /**
   * 現在のユーザーログイン
   */
  userLogin: any;
  selectCurrent: any;

  /**
   * オープンモーダル
   */
  open = false;
  statusOpen = null;

  /**
   * Class
   */
  classArr: any[] = [];

  /**
   * Skill
   */
  skillArr: any[] = [];

  /**
   * コンストラクタ
   * @param productService
   * @param techClassService
   */
  constructor(
    private productService: ProductService,
    private techClassService: TechClassificationService,
    private techService: TechService,
    private taxService: TaxService,
    private authService: AuthService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.numberOnlyRegex = RegexValidator.numberOnlyRegex;
    this.listTaxes = await this.getTaxList();
    this.listItems = await this.getClassList();
  }

  /**
   * 税金リストを取得する
   */
  async getTaxList(): Promise<Tax[]> {
    return await this.taxService.getTaxList(this.shopId).toPromise();
  }

  /**
   * モーダルを閉じる
   * @param event
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      this.listItems = await this.getListItem();
    }
    this.open = event.open;
  }

  /**
   * レジスターを開く
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
  selectItem(input: Product): void {
    this.selectCurrent = input;
    this.openModal('update');
  }

  /**
   * 分類情報一覧を取得する
   */
  async getClasses(): Promise<any[]> {
    return await this.techClassService
      .getClasses(this.userLogin.shopId, this.categoryCd)
      .toPromise();
  }

  /**
   * ドロップリストを処理する
   *
   * @param {Event} event
   * @param {String[]} classId
   *
   * @return void
   */
  handleDropList(event: CdkDragDrop<string[]>, classId: number): void {
    this.listItemsFilter = this.listItems.filter(
      (item) => item.class_id === classId
    );
    let beforeIndex: number = event.previousIndex;
    let afterIndex: number = event.currentIndex;
    const before: Product = this.listItemsFilter[beforeIndex];
    const after: Product = this.listItemsFilter[afterIndex];
    for (const { index, value } of this.listItems.map((value, index) => ({
      index,
      value,
    }))) {
      if (before.id == value.id) {
        beforeIndex = index;
      }
      if (after.id == value.id) {
        afterIndex = index;
      }
    }
    moveItemInArray(this.listItems, beforeIndex, afterIndex);
    this.updateSortItems();
  }

  /**
   * 並べ替えアイテムを更新
   */
  updateSortItems(): void {
    for (let i = 0; i < this.listItems.length; i++) {
      this.listItems[i].sort = i;
    }

    const product = {
      shopId: this.shopId,
      list: JSON.stringify(this.listItems),
    };

    // Update list product
    this.productService.updateListItems(product).subscribe((data) => {
      this.getListItem();
    });
  }

  /**
   * リストアイテムを取得する
   */
  async getListItem(): Promise<any[]> {
    return await this.productService.getListProduct(this.shopId).toPromise();
  }

  /**
   * タイプのアイテムをフィルタリングする
   *
   * @param {Number} classId
   *
   * @returns タイプclassIdの製品
   */
  filterItemsOfType(classId: number): any {
    return this.listItems.filter((x) => x.class_id === classId).sort((a, b) => Number(a.sort) - Number(b.sort));
  }

  /**
   * Toggle list
   */
  toggleAccordian(event: any, index): any {
    event.classList.toggle('active');
    if (this.classArr[index].isActive) {
      this.classArr[index].isActive = true;
    } else {
      this.classArr[index].isActive = false;
    }
    const panel = event.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;

    }
  }


  /**
   * スキルリストを取得する
   */
  async getClassList(): Promise<any> {
    const skills = await this.productService.getListProduct(this.shopId).toPromise();
    skills.forEach((skill: any) => {
      let isExisted = false;
      for (const item of this.classArr) {
        if (skill.class == null || item.id === skill.class?.id) {
          isExisted = true;
          break;
        }
      }

      if (!isExisted) {
        this.classArr.push(skill.class);
      }

      if (skill.class) {
        this.skillArr.push(skill);
      }

    });

    this.classArr.sort((a, b) => Number(a.sort) - Number(b.sort));
    return skills;
  }
}
