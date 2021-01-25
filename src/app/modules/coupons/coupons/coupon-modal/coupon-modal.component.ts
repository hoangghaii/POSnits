import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ColorTypeSetting, RegexValidator } from 'src/app/constants/global-const';
import { Constants } from 'src/app/constants/constants';
import { Helper } from 'src/app/core/utils/helper';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { AuthService, ModalService, ValidatorService } from 'src/app/core/services';
import { TranslateService } from '@ngx-translate/core';
import { CouponMenuService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-coupon-modal',
  templateUrl: './coupon-modal.component.html',
  styleUrls: ['./coupon-modal.component.scss']
})
export class CouponModalComponent implements OnChanges {

  userLogin;
  couponForm: FormGroup;
  public formMap = {
    name: '',
    targetFlg: '',
    webFlg: '',
    colorCode: '',
    discount: '',
    startDate: '',
    endDate: '',
    details: {}
  };

  public colorValue = '';
  public currentPickedColor: string = null;
  public presetColors = ColorTypeSetting.defaultColors;
  public isOpenMenu = false;
  public selectCurrent: any = '';
  public flag: boolean;
  public listMenu = [];
  public listDetails: FormArray;
  public submitted = false;
  public listWeb: object = Constants.listTechWeb;
  public listTargets: object = Constants.listTarget;
  public checkDate = true;
  public helper = Helper;
  menuSelected;
  @Input() open = false;
  @Input() coupon;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private modalService: ModalService,
    private translate: TranslateService,
    private couponMenuService: CouponMenuService) {
  }

  /**
   * Onchange
   */
  async ngOnChanges(): Promise<void> {
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    if (this.coupon != null && this.coupon.hasOwnProperty('id')) {
      this.coupon = await this.couponMenuService.getCouponMenu(this.userLogin.shop_id, this.coupon?.id).toPromise();
      this.setFormData(this.coupon);
    }
  }

  /**
   * Init Form
   */
  initForm(): void {
    this.submitted = false;
    this.currentPickedColor = '#ffffff';

    this.translate.get('couponMenuRegistration').subscribe((trans) => {
      this.formMap = {
        name: trans?.name,
        targetFlg: trans?.target_flag,
        webFlg: trans?.web_flag,
        colorCode: trans?.colorCode,
        startDate: trans?.start_date,
        endDate: trans?.start_date,
        discount: trans?.discount,
        details: {
          discount: trans?.discount,
        }
      };
    });

    this.couponForm = this.fb.group({
      id: [''],
      classId: [''],
      categoryCd: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      sort: ['0'],
      targetFlg: ['0', ValidatorService.required],
      webFlg: ['0', ValidatorService.required],
      colorCode: ['', ValidatorService.required],
      updatedAt: [''],
      startDate: ['', ValidatorService.required],
      endDate: [
        '',
        [ValidatorService.required,
        ValidatorService.isGteDate('start_date', false)]
      ],
      details: new FormArray([]),
    });
  }

  /**
   * Set data
   */
  setFormData(couponMenu): void {
    const coupon = {
      id: couponMenu.id,
      classId: couponMenu.class_id,
      categoryCd: couponMenu.category_cd,
      name: couponMenu.name,
      webFlg: couponMenu.web_flg,
      targetFlg: couponMenu.target_flg,
      colorCode: couponMenu.color_code,
      startDate: couponMenu.start_date,
      endDate: couponMenu.end_date,
      sort: couponMenu.sort,
      details: couponMenu.details.map((m) => {
        return {
          id: m.id,
          couponId: m.coupon_id,
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

    this.menuSelected = couponMenu.details;
    this.couponForm.patchValue(coupon);
    this.currentPickedColor = '#' + coupon.colorCode;
    coupon.details.map(data => {
      this.details.controls.push(this.addFormDetail(data, true));
    });
  }

  /**
   * Add form Detail
   */
  addFormDetail(menu, update = false): FormGroup {
    const detailForm = this.fb.group({
      id: [null],
      couponId: [null],
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
      classId: [menu.class_id]
    });

    if (update) {
      detailForm.controls.couponId.setValue(menu.couponId);
      detailForm.controls.categoryCd.setValue(menu.categoryCd);
      detailForm.controls.classId.setValue(menu.classId);
    } else {
      detailForm.controls.classId.setValue(menu.class_id);
    }

    return detailForm;
  }

  /**
   * Update || Delete coupon menu
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
   * 確認を送信
   */
  handleConfirm(event): void {
    // 更新
    if (event.name === 'update') {
      if (this.couponForm.invalid) {
        return;
      }
      const data: any = this.parseCoupon(this.couponForm.getRawValue());
      data.updated_at = this.coupon.updated_at;
      this.couponMenuService
        .updateCoupon(String(this.userLogin.shop_id), data)
        .subscribe((res) => {
          this.confirm.emit({ isOpen: false, isReload: true });
          this.translate
            .get('msgCompleted.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    } else if (event.name === 'delete') { // Delete
      this.couponMenuService
        .deleteCouponMenu(String(this.userLogin.shop_id), String(this.coupon.id))
        .subscribe((res) => {
          this.confirm.emit({ isOpen: false, isReload: true });
          this.translate
            .get('msgCompleted.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }

  /**
   * Update menu item
   */
  updateMenuItems(event): void {
    if (event.menus) {
      const detailForm = this.couponForm.get('details') as FormArray;
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
   * Parse coupon
   */
  parseCoupon(coupon): object {
    return {
      id: coupon.id,
      class_id: coupon.details[0].classId,
      category_cd: '4',
      name: coupon.name,
      web_flg: coupon.webFlg,
      target_flg: coupon.targetFlg,
      color_code: coupon.colorCode,
      start_date: coupon.startDate,
      end_date: coupon.endDate,
      sort: coupon.sort,
      details: coupon.details.map((m) => {
        return {
          id: m.id,
          coupon_id: m.couponId,
          category_cd: m.categoryCd,
          discount: m.discount,
          updated_at: m.updatedAt,
          menu_id: m.menuId
        };
      })
    };
  }

  /**
   * Open Menu
   */
  openMenuModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.isOpenMenu = true;
  }

  /**
   * Create coupon
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.couponForm.valid) {
      return;
    }

    this.couponMenuService
      .createCoupon(String(this.userLogin.shop_id), this.parseCoupon(this.couponForm.getRawValue()))
      .subscribe(res => {
        this.confirm.emit({ isReload: true, isOpen: false });
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
          });
      });
  }

  /**
   * カラーピッカーから色を取得
   */
  getValueColor(color: any): void {
    this.colorValue = color.replace('#', '');
    this.couponForm.controls.colorCode.setValue(this.colorValue);
  }

  /**
   * Close modal
   */
  close(): void {
    this.confirm.emit({ isReload: false, isOpen: false });
  }

  /**
   * Get details coupon form
   */
  get details(): FormArray {
    return this.couponForm.get('details') as FormArray;
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.couponForm.controls;
  }
}
