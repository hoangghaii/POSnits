import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { TechClassification } from 'src/app/core/models';
import { AuthService, ModalService } from 'src/app/core/services';
import { StaffMenuService, StaffService, TechClassificationService } from 'src/app/core/services/apis';
import { ValidatorService } from 'src/app/core/services/validator.service';
import { Helper } from 'src/app/core/utils/helper';

@Component({
  selector: 'app-menu-cooperation-staff',
  templateUrl: './menu-cooperation-staff.component.html',
  styleUrls: ['./menu-cooperation-staff.component.scss']
})
export class MenuCooperationStaffComponent implements OnInit {
  userLogin;
  shopId;
  listStaff: any[] = [];
  public techClassListTech: any[] = [];
  public techClassListCourse: any[] = [];
  staffId;
  staffMenuList = [];
  isOpen = false;
  reserveList;
  submitted = false;
  formMap;
  staffForm: FormGroup;
  helper = Helper;

  constructor(
    private staffService: StaffService,
    private authService: AuthService,
    private staffMenuService: StaffMenuService,
    private techClassService: TechClassificationService,
    private translate: TranslateService,
    private modalService: ModalService,
    private fb: FormBuilder,
  ) {
    this.staffForm = this.fb.group({
      staffId: ['', ValidatorService.selectRequired],
    });
  }

  /**
   * コンポネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.translate.get('menuCooperationStaff.selectStaff').subscribe((trans) => {
      this.formMap = {
        staffId: trans
      };
    });
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.listStaff = await this.staffService.getStaffList(this.userLogin.shop_id).toPromise();
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
   * Get Staff Menu List
   */
  getStaffMenuList(): void {
    this.staffId = this.staffForm.controls.staffId.value;
    this.staffMenuList = [];
    if (this.staffId !== '') {
      this.staffMenuService.getStaffMenuList(this.staffId).subscribe((res) => {
        this.staffMenuList = res;
      });
    }
  }

  /**
   * Get Class List
   */
  async getClassList(): Promise<TechClassification[]> {
    return await this.techClassService
      .getClassesList(this.shopId)
      .toPromise();
  }

  /**
   * Delete Staff Menu
   * @param menuId
   */
  deleteStaffMenu(menuId): void {
    this.staffMenuService.deleteStaffMenu(this.staffId, menuId).subscribe(() => {
      this.translate.get('msgCompleted.deletetionHasBeenCompleted').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
      this.getStaffMenuList();
    })
  }

  /**
   * タイプのアイテムをフィルタリングする
   * @param id
   */
  filterItemsOfType(id: number): any {
    return this.staffMenuList.filter((x) => x.details[0].class_id == id);
  }

  /**
    * レジスターを開く
    */
  openModal(): void {
    this.submitted = true;
    if (this.staffId !== undefined && this.staffId !== '') {
      this.isOpen = true;
    }
  }

  /**
   * モーダルを閉じる
   */
  async confirmModal(event: any): Promise<void> {
    this.isOpen = event.open;
    if (event.name != undefined && event.name == 'getList') {
      this.getStaffMenuList();
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
}
