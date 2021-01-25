import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {ConfirmModalComponent} from '../../../../core/directives/confirm-modal.component';
import {Constants} from '../../../../constants/constants';
import {AuthService, ModalService, ValidatorService} from '../../../../core/services';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {ColorTypeSetting, RegexValidator} from '../../../../constants/global-const';
import {MenuRegistrationService, SetMenuService} from '../../../../core/services/apis';
import {newArray} from '@angular/compiler/src/util';

@Component({
  selector: 'app-modal-set-menu',
  templateUrl: './modal-set-menu.component.html',
  styleUrls: ['./modal-set-menu.component.scss']
})
export class ModalSetMenuComponent implements OnChanges {
  userLogin;
  setMenuForm: FormGroup;
  public formMap = {
    name: '',
    webFlg: '',
    colorCode: '',
    details: {},
  };
  public colorValue = '';
  public currentPickedColor: string = null;
  public defaultColor = '';
  public presetColors = ColorTypeSetting.defaultColors;
  submitted: boolean;
  selectCurrent = null;
  isOpenMenu;
  menuSelected: any[] = [];
  public listWeb: object = Constants.listTechWeb;
  @Input() isOpen: boolean;
  @Input() menuData;
  @Input() setMenu: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private menuService: SetMenuService,
              private modalService: ModalService,
              private translate: TranslateService) {
  }


  async ngOnChanges(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    if (this.setMenu != null && this.setMenu.hasOwnProperty('id')) {
      this.setMenu = await this.menuService.getSetMenu(this.userLogin.shop_id, this.setMenu?.id).toPromise();
      this.setFormData(this.setMenu);
    }
  }

  initForm(): void {
    this.submitted = false;
    this.currentPickedColor = '#ffffff';
    this.translate.get('menuRegistration').subscribe((trans) => {
      this.formMap.name = trans?.title;
    });
    this.translate.get('tech').subscribe((trans) => {
      this.formMap.webFlg = trans?.webFlg;
    });
    this.translate.get('common').subscribe((trans) => {
      this.formMap.colorCode = trans?.colorCode;
    });
    this.translate.get('discount').subscribe((trans) => {
      this.formMap.details = {
        discount: trans?.discount
      };
    });

    const color: string = this.defaultColor.replace('#', '');
    this.setMenuForm = this.fb.group({
      id: [null],
      classId: [''],
      categoryCd: [Constants.categoryClass.SETMENU],
      shopId: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      webFlg: ['0', ValidatorService.required],
      colorCode: [color, ValidatorService.required],
      sort: [null],
      updatedAt: [null],
      details: new FormArray([]),
    });
  }

  /**
   * Add form Detail
   */
  addFormDetail(menu, update = false): FormGroup {
    const detailForm = this.fb.group({
      id: [null],
      setMenuId: [null],
      categoryCd: [menu.category_cd],
      menuId: [menu.id],
      discount: [
        menu?.discount !== undefined ? menu?.discount : '',
        [
          ValidatorService.required,
          ValidatorService.pattern(RegexValidator.numberOnlyRegex),
          ValidatorService.maxLength(20),
        ],
      ],
      updatedAt: [null],
      price: [menu.price],
      name: [menu.name],
      classId: [null]
    });

    if (update) {
      detailForm.controls.setMenuId.setValue(menu.setMenuId);
      detailForm.controls.categoryCd.setValue(menu.categoryCd);
      detailForm.controls.classId.setValue(menu.classId);
    } else {
      detailForm.controls.classId.setValue(menu.class_id);
    }

    return detailForm;
  }

  close(): void {
    this.confirm.emit({isReload: false, isOpen: false});
  }

  /**
   * カラーピッカーから色を取得
   */
  getValueColor(color: any): void {
    this.colorValue = color.replace('#', '');
    this.setMenuForm.controls.colorCode.setValue(this.colorValue);
  }

  /**
   * Open popup menu
   */
  openMenuItemsModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.isOpenMenu = true;
  }

  /**
   * Update menu
   */
  updateMenuItems(event): void {
    if (event.menus) {
      const detailForm = this.setMenuForm.get('details') as FormArray;
      detailForm.controls = [];
      this.menuSelected = event.menus;
      event.menus.forEach((menu) => {
        const menuItem: FormGroup = this.addFormDetail(menu);
        detailForm.push(menuItem);
      });
    }

    this.isOpenMenu = event.isOpen;
  }

  /**
   * Get staffs form
   */
  get details(): FormArray {
    return this.setMenuForm.get('details') as FormArray;
  }

  /**
   * Update
   */
  updateMenu(isDelete = false): void {
    if (isDelete) {
      this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
        this.confirmModal.prompt(msg, null, true, 'delete');
      });
    } else {
      this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
        this.confirmModal.prompt(msg, null, true, 'update');
      });
    }
  }

  /**
   * Create menu
   */
  setFormData(setMenu): void {
    const menu = {
      id: setMenu.id,
      classId: setMenu.class_id,
      categoryCd: setMenu.category_cd,
      name: setMenu.name,
      webFlg: setMenu.web_flg,
      colorCode: setMenu.color_code,
      sort: setMenu.sort,
      details: setMenu.details.map((m) => {
        return {
          id: m.id,
          setMenuId: m.setmenu_id,
          categoryCd: m.category_cd,
          discount: m.discount,
          updatedAt: m.updated_at,
          price: m.price,
          name: m.name,
          menuId: m.menu_id,
          classId: m.class_id
        };
      })
    };

    this.menuSelected = setMenu.details;
    this.setMenuForm.patchValue(menu);
    this.currentPickedColor = '#' + menu.colorCode;
    menu.details.map(data => {
      this.details.controls.push(this.addFormDetail(data, true));
    });
  }

  /**
   * Create menu
   */
  parseSetMenu(data): object {
    return {
      id: data.id,
      class_id: data.classId ? data.classId : data.details[0].classId,
      category_cd: '4',
      name: data.name,
      web_flg: data.webFlg,
      color_code: data.colorCode,
      sort: data.sort,
      details: data.details.map((m) => {
        return {
          id: m.id,
          setmenu_id: m.setMenuId,
          category_cd: m.categoryCd,
          discount: m.discount,
          updated_at: m.updatedAt,
          price: m.price,
          name: m.name,
          menu_id: m.menuId,
          class_id: m.classId
        };
      })
    };
  }

  /**
   * Create set menu
   */
  createMenu(): void {
    this.submitted = true;
    if (!this.setMenuForm.valid) {
      return;
    }
    this.menuService
      .createSetMenu(String(this.userLogin.shop_id), this.parseSetMenu(this.setMenuForm.getRawValue()))
      .subscribe((res) => {
        this.confirm.emit({isReload: true, isOpen: false});
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
          });
      });
  }

  /**
   * 確認を送信
   */
  handleConfirm(event): void {
    // 更新
    if (event.name === 'update') {
      if (!this.setMenuForm.valid) {
        return;
      }
      const setMenu: any = this.parseSetMenu(this.setMenuForm.getRawValue());
      setMenu.updated_at = this.setMenu.updated_at;
      this.menuService
        .updateSetMenu(String(this.userLogin.shop_id), setMenu)
        .subscribe((res) => {
          this.confirm.emit({isOpen: false, isReload: true});
          this.translate
            .get('msgCompleted.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }

    // 削除
    if (event.name === 'delete') {
      this.menuService
        .deleteSetMenu(String(this.userLogin.shop_id), String(this.setMenu.id))
        .subscribe((res) => {
          this.confirm.emit({isOpen: false, isReload: true});
          this.translate
            .get('msgCompleted.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }
}
