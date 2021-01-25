import { BasicShiftService } from 'src/app/core/services/apis';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services';
import { BasicShift } from 'src/app/core/models';
import { Helper } from 'src/app/core/utils/helper';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
/**
 * BasicShiftComponent
 * 基本的なシフトコンポーネント
 */
@Component({
  selector: 'app-basic-shift',
  templateUrl: './basic-shift.component.html',
  styleUrls: ['./basic-shift.component.scss'],
})
export class BasicShiftComponent implements OnInit {

  public shopId: string = '';
  public listBasicShift : BasicShift[] =[];
  public basicShiftId :string
  public helper = Helper;
  /**
   * current user login
   */
  userLogin: any;
  /**
   * オープンモーダル
   */
  open = false;
  constructor(
    private authService: AuthService,
    private basicShiftService: BasicShiftService
  ) {}
  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void>{
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.getBasicShiftList();
  }
  /**
   * モーダルを閉じる
   * @param event
   */
  closeModal(event: any): void {
    if (event.status && event.status === 'upCreate') {
      this.getBasicShiftList();
    }
    this.open = event.open;
  }
  /**
   * 基本的なシフトリストを取得する
   */
  getBasicShiftList(){
    this.basicShiftService.getBasicShiftList(String(this.shopId)).subscribe(res =>{
      this.listBasicShift = res;
    })
  }
  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.basicShiftId = null;
    }
    this.open = true;
  }

  /**
   * アイテムを選択
   * @param input
   */
  selectItem(input: any) {
    this.basicShiftId = input;

    this.openModal('update');
  }

  /**
   * 落とす
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.listBasicShift,
      event.previousIndex,
      event.currentIndex
    );
    for (let i = 0; i < this.listBasicShift.length; i++) {
      this.listBasicShift[i].sort = i;
    }
    this.updateSortIndex();
  }

  /**
   * 分類情報一覧を取得する
   */
  updateSortIndex(): void {
    let body = {
      shopId: this.userLogin.shop_id,
      list: this.listBasicShift,
    };
    this.basicShiftService.updateBasicShiftListSort(body).subscribe(() => (this.getBasicShiftList()));
  }
}
