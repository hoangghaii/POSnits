import {Component, EventEmitter, Input, OnInit, Output, OnChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {Constants} from 'src/app/constants/constants';
import {ModalService} from 'src/app/core/services/modal.service';
import {StaffService} from 'src/app/core/services/apis/staff.service';
import {UploadService, ValidatorService} from 'src/app/core/services';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import { SystemSetting } from 'src/app/constants/global-const';

@Component({
  selector: 'app-staff-create-modal',
  templateUrl: './staff-create-modal.component.html',
  styleUrls: ['./staff-create-modal.component.scss']
})
export class StaffCreateModalComponent implements OnInit, OnChanges {
  /**
   * Form
   */
  formRegister: FormGroup;

  /**
   * Form map item
   */
  formMap;

  /**
   * Check validator
   */
  submitted = false;

  /**
   * List gender
   */
  sexList = Constants.sex;

  imagesUrl: string;

  @Input() userLogin: any;
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Input() shopList: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(
    private fb: FormBuilder,
    private staffService: StaffService,
    private uploadService: UploadService,
    private modalService: ModalService,
    private translate: TranslateService) {
  }

  /**
   * Change popup
   */
  ngOnChanges(): void {
    this.imagesUrl = null;
    if (this.open && this.selectCurrent) {
      this.staffService.getStaff(String(this.selectCurrent.shop_id), String(this.selectCurrent.id)).subscribe((res: any) => {
        this.formRegister.patchValue({
          id: res[0].id,
          name: res[0].name,
          nameKana: res[0].name_kana,
          sex: res[0].sex,
          staffImg: res[0].staff_img,
          updatedAt: res[0].updated_at,
          sort: res[0].sort,
        });
        if (res[0].staff_img !== null && res[0].staff_img !== '') {
          this.imagesUrl = res[0].staff_img;
        }
      });
    }
    if (this.open && this.selectCurrent === null) {
      this.initForm();
      this.submitted = false;
    }
    if (this.shopList  !== undefined) {
      this.formRegister.controls.shopId.setValue(this.shopList[0].company_id);
    }
  }

  /**
   * コンポーネント初期処理
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('addStaff.staffCreate').subscribe((trans) => {
      this.formMap = {
        staffImg: trans?.staffPhoto,
        name: trans?.staffName,
        nameKana: trans?.frigana,
        sex: trans?.sex,
        shopId: trans?.affiliationStore,
      };
    });

    this.formRegister = this.fb.group({
      id: [null],
      staffImg: [null],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(20)]],
      nameKana: ['', [ValidatorService.required, ValidatorService.isCharacterKatakana, ValidatorService.maxLength(40)]],
      sex: ['0'],
      shopId: [''],
      updatedAt: [null],
      sort: [null],
    });
  }

  /**
   * Close modal
   */
  closeModal(): void {
    this.submitted = false;
    this.formRegister.reset();
    this.confirm.emit({open: false});
  }

  /**
   * Create and update
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.formRegister.valid) {
      return;
    }
    const obj: any = this.parserObj(this.formRegister.getRawValue());
    obj.sex = obj.sex === '' ? null : obj.sex;

    this.staffService.createStaff(String(this.userLogin.shop_id), obj)
      .subscribe((res) => {
        this.confirm.emit({open: false, status: 'upCreate'});
        this.translate.get('addStaff.staffCreate.registrationHasBeenCompleted').subscribe((msg: string) => {
          this.modalService.open(msg);
        });
      });
  }

  /**
   * Update
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.formRegister.valid) {
      return;
    }

    this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'update');
    });
  }

  /**
   * Delete
   */
  handleDelete(): void {
    this.submitted = true;

    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });

  }

  /**
   * Emit confirm
   */
  handleConfirm(event) {
    const obj: any = this.parserObj(this.formRegister.getRawValue());
    obj.sex = obj.sex === '-1' ? null : obj.sex;

    if (JSON.stringify(obj.staff_img) === JSON.stringify({})) {
      if (obj.staff_img.indexOf('upload/staff') != -1) {
        const staff_arr = obj.staff_img.split("upload/staff");
        obj.staff_img = "upload/staff" + staff_arr[1];
      }
    }
    // Update
    if (event.name === 'update') {
      this.staffService.updateStaff(String(this.userLogin.shop_id), String(this.selectCurrent.id), obj)
        .subscribe(res => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate.get('addStaff.staffCreate.updateHasBeenCompleted').subscribe((msg: string) => {
            this.modalService.open(msg);
          });
        });
    }

    // Delete
    if (event.name === 'delete') {
      this.staffService.deleteStaff(String(this.userLogin.shop_id), String(this.selectCurrent.id))
        .subscribe(res => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate.get('addStaff.staffCreate.deletetionHasBeenCompleted').subscribe((msg: string) => {
            this.modalService.open(msg);
          });
        });
    }
  }

  /**
   * ファイル選択後処理
   */
  fileSelected(event): void {
    this.formRegister.controls.staffImg.setValue(event.file.path);
  }

  /**
   * Parse obj
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: obj.shopId,
      name: obj.name,
      sex: obj.sex,
      name_kana: obj.nameKana,
      staff_img: obj.staffImg,
      sort: obj.sort,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * Get form control
   */
  get f() {
    return this.formRegister.controls;
  }
}
