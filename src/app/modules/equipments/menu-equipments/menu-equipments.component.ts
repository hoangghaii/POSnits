import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {EquipmentMenuService, EquipmentService, TechClassificationService} from 'src/app/core/services/apis';
import {AuthService, ModalService, ValidatorService} from 'src/app/core/services';
import {TechClassification} from 'src/app/core/models';
import {TranslateService} from '@ngx-translate/core';
import { Helper } from 'src/app/core/utils/helper';
import { Constants } from 'src/app/constants/constants';

@Component({
  selector: 'app-menu-equipments',
  templateUrl: './menu-equipments.component.html',
  styleUrls: ['./menu-equipments.component.scss']
})
export class MenuEquipmentsComponent implements OnInit {
  userLogin;
  equipmentId;
  listEquipment: any[] = [];
  public techClassList: any[] = [];
  public techClassListTech: any[] = [];
  public techClassListCourse: any[] = [];
  formEquipment: FormGroup;
  equipmentMenuList = [];
  isOpen = false;
  selectCurrent;
  submitted = false;
  formMap: any;
  helper = Helper;

  constructor(
    private equipmentService: EquipmentService,
    private authService: AuthService,
    private equipmentMenuService: EquipmentMenuService,
    private techClassService: TechClassificationService,
    private translate: TranslateService,
    private modalService: ModalService,
    private fb: FormBuilder,
  ) {
    this.formEquipment = this.fb.group({
      equipmentId: ['', ValidatorService.selectRequired],
    });
  }

  /**
   * コンポネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.translate.get('menuCooperationEquipment.menuCooperationEquipment').subscribe((trans) => {
      this.formMap = {
        equipmentId: trans
      };
    });
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listEquipment = await this.equipmentService.getEquipmentList(this.userLogin.shop_id).toPromise();
    const techClassList = await this.getClassList();
    techClassList.sort((a ,b) => {
      return (Number(a.id) - Number(b.id));
    })
    this.techClassListTech = techClassList.filter(item => {
      return item.category_cd == Constants.categoryClass.TECH;
    })
    this.techClassListCourse = techClassList.filter(item => {
      return item.category_cd == Constants.categoryClass.COURSE;
    })
  }

  /**
   * Get Equipment menu list
   */
  getEquipmentMenuList(): void {
    this.equipmentId = this.formEquipment.controls.equipmentId.value;
    this.equipmentMenuList = [];
    if (this.equipmentId !== '') {
      this.equipmentMenuService.getEquipmentMenuList(this.equipmentId).subscribe((res) => {
        this.equipmentMenuList = res;
      });
    }
  }

  /**
   * Get Class List
   */
  async getClassList(): Promise<TechClassification[]> {
    return await this.techClassService
      .getClassesList(this.userLogin.shop_id)
      .toPromise();
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string, item?): void {
    this.submitted = true;
    if (this.equipmentId !== '' && this.equipmentId !== undefined) {
      this.isOpen = true;
    }
    // TODO
    // if (status === 'update') {
    //   this.selectCurrent = item;
    // } else {
    //   this.selectCurrent = null;
    // }
  }

  /**
   * モーダルを閉じる
   */
  async confirmModal(event: any): Promise<void> {
    this.isOpen = event.open;
    if (event.name != undefined && event.name == 'getList') {
      this.getEquipmentMenuList();
    }
  }

  /**
   * Delete Equipment Menu
   * @param menuId
   */
  deleteEquimentMenu(menuId): void {
    this.equipmentMenuService.deleteEquipmentMenu(this.equipmentId, menuId).subscribe(() => {
      this.translate.get('msgCompleted.deletetionHasBeenCompleted').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
      this.getEquipmentMenuList();
    });
  }

  /**
   * タイプのアイテムをフィルタリングする
   * @param id
   */
  filterItemsOfType(id: number): any {
    return this.equipmentMenuList.filter((x) => x.details[0].class_id == id);
  }

  /**
   * Toggle list
   */
  toggleAccordian(event: any): any {
    event.classList.toggle('active');
    const panel = event.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    } else {
      panel.style.maxHeight = null;
    }
  }

  check(list) {
    let flag = false;
    for (let tcl of list) {
      if (this.filterItemsOfType(tcl.id)?.length > 0) {
        flag = true;
      }
    }
    return flag;
  }
}
