import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {TranslateService} from '@ngx-translate/core';
import {Constants} from 'src/app/constants/constants';
import {EquipmentService} from 'src/app/core/services/apis';
import {ModalService, ValidatorService} from 'src/app/core/services';
import {Equipment} from 'src/app/core/models';

@Component({
  selector: 'app-modal-equipment',
  templateUrl: './modal-equipment.component.html',
  styleUrls: ['./modal-equipment.component.scss']
})
export class ModalEquipmentComponent implements OnInit, OnChanges {
  public equipmentForm: FormGroup;
  public listEquipmentCd = Constants.listEqupmentCd;
  formMap: object;

  @Input() shopId: any;
  @Input() equipmentId: any;
  @Input() open: boolean;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  submitted: boolean;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private equipmentService: EquipmentService,
    private modalService: ModalService
  ) {
  }

  /**
   * ポップアップを変更する
   */
  ngOnChanges(): void {
    if (this.equipmentId !== null && this.open) {
      this.equipmentService
        .getEquipment(String(this.shopId), String(this.equipmentId))
        .subscribe((res: any) => {
          this.equipmentForm.patchValue({
            id: res[0].id,
            name: res[0].name,
            shopId: res[0].shop_id,
            updatedAt: res[0].updated_at,
            equipmentCd: res[0].equpment_cd,
            amount: res[0].amount,
          });
        });
    }
    if (this.equipmentId === null && this.open) {
      this.submitted = false;
      this.initForm();
      this.equipmentForm.patchValue({
        shopId: this.shopId,
        equipmentCd: '01',
      });
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
    this.translate.get('equipment').subscribe((trans) => {
      this.formMap = {
        name: trans?.name,
        equipmentCd: trans?.type,
        amount: trans?.amount

      };
    });
    this.equipmentForm = this.fb.group({
      id: [''],
      shopId: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(255)]],
      equipmentCd: ['', ValidatorService.selectRequired],
      amount: ['', [ValidatorService.required, ValidatorService.isNumber, ValidatorService.min(1), ValidatorService.maxLength(11)]],
      updatedAt: [''],
      sort: [0],
    });
  }

  /**
   * 確認を送信
   */
  handleConfirm(event): void {
    const obj: Equipment = this.parserObj(this.equipmentForm.value);

    // 更新
    if (event.name === 'update') {
      this.equipmentService
        .updateEquipment(String(this.shopId), [obj], this.equipmentId)
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('msgCompleted.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              this.initForm();
              this.submitted = false;
            });
        });
    }

    // 削除
    if (event.name === 'delete') {
      this.equipmentService
        .deleteEquipment(String(this.shopId), String(this.equipmentId))
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('msgCompleted.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }

  /**
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.equipmentForm.valid) {
      return;
    }

    const obj: Equipment = this.parserObj(this.equipmentForm.value);
    this.equipmentService
      .createEquipment(String(this.shopId), [obj])
      .subscribe((res) => {
        this.confirm.emit({open: false, status: 'upCreate'});
        this.translate
          .get('msgCompleted.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
            this.initForm();
            this.submitted = false;
          });
      });
  }

  /**
   * 更新
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.equipmentForm.valid) {
      return;
    }
    this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'update');
    });
  }

  /**
   * 削除
   */
  handleDelete(): void {
    this.submitted = true;

    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): Equipment {
    return {
      id: obj.id,
      shop_id: this.shopId,
      name: obj.name,
      equpment_cd: obj.equipmentCd,
      amount: obj.amount,
      updated_at: obj.updatedAt,
      sort: obj?.sort,
    };
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.equipmentForm.reset();
    this.confirm.emit({open: false});
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.equipmentForm.controls;
  }

  get v() {
    return this.equipmentForm.value;
  }
}
