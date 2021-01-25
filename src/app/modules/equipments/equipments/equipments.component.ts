import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import {Component, OnInit} from '@angular/core';
import {Equipment} from 'src/app/core/models';
import {AuthService} from 'src/app/core/services';
import {EquipmentService} from 'src/app/core/services/apis';

@Component({
  selector: 'app-equipments',
  templateUrl: './equipments.component.html',
  styleUrls: ['./equipments.component.scss']
})
export class EquipmentsComponent implements OnInit {
  public shopId = '';
  public listEquipment: Equipment[] = [];
  public equipmentId: string;

  /**
   * Current user login
   */
  userLogin: any;

  /**
   * オープンモーダル
   */
  open = false;

  constructor(
    private authService: AuthService,
    private equipmentService: EquipmentService
  ) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.getEquipmentList();
  }

  /**
   * モーダルを閉じる
   * @param event
   */
  closeModal(event: any): void {
    if (event.status && event.status === 'upCreate') {
      this.getEquipmentList();
    }
    this.open = event.open;
  }

  /**
   * 基本的なシフトリストを取得する
   */
  getEquipmentList(): void {
    this.equipmentService.getEquipmentList(String(this.shopId)).subscribe((res) => {
      this.listEquipment = res;
    });
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.equipmentId = null;
    }
    this.open = true;
  }

  /**
   * アイテムを選択
   */
  selectItem(input: any): void {
    this.equipmentId = input;
    this.openModal('update');
  }

  /**
   * ドロップリストを処理する
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listEquipment, event.previousIndex, event.currentIndex);
    this.updateSortItems();
  }

  /**
   * 並べ替えアイテムを更新
   */
  updateSortItems(): void {
    for (let i = 0; i < this.listEquipment.length; i++) {
      this.listEquipment[i].sort = i;
    }

    const obj = {
      shopId: this.shopId,
      list: JSON.stringify(this.listEquipment),
    };

    // Update list equipment
    this.equipmentService.updateEquipmentListSort(obj).subscribe((data) => {
      this.getEquipmentList();
    });
  }
}
