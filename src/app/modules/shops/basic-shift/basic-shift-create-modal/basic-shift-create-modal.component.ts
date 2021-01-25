import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  ViewChild,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {RegexValidator} from 'src/app/constants/global-const';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {BasicShift} from 'src/app/core/models';
import {ModalService, ValidatorService} from 'src/app/core/services';
import {BasicShiftService} from 'src/app/core/services/apis';
import {Helper} from 'src/app/core/utils/helper';

/**
 * BasicShiftCreateModalComponent
 * 基本シフトモーダルコンポーネントの作成
 */
@Component({
  selector: 'app-basic-shift-create-modal',
  templateUrl: './basic-shift-create-modal.component.html',
  styleUrls: ['./basic-shift-create-modal.component.scss'],
})
export class BasicShiftCreateModalComponent implements OnInit, OnChanges {
  public basicShiftForm: FormGroup;
  public openingTimeList: any[] = Helper.generateTime(24);
  public closingTimeList: any[] = Helper.generateTime(24);
  @Input() shopId: any;
  @Input() basicShiftId: any;
  @Input() open: boolean;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  submitted: boolean;
  formMap;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private basicShiftService: BasicShiftService,
    private modalService: ModalService
  ) {
  }

  /**
   * ポップアップを変更する
   */
  ngOnChanges(): void {
    if (this.basicShiftId !== null && this.open) {
      this.basicShiftService
        .getBasicShift(String(this.shopId), String(this.basicShiftId))
        .subscribe((res: any) => {
          this.basicShiftForm.patchValue({
            id: res[0].id,
            name: res[0].name,
            shopId: res[0].shop_id,
            updatedAt: res[0].updated_at,
            startTime: res[0].start_time.substr(0, 5),
            endTime: res[0].end_time.substr(0, 5),
          });
        });
    }
    if (this.basicShiftId === null && this.open) {
      this.submitted = false;
      this.initForm();
      this.basicShiftForm.patchValue({
        shopId: this.shopId,
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
  initForm() {
    this.translate.get('basicShift').subscribe((trans) => {
      this.formMap = {
        name: trans?.shiftName,
        startTime: trans?.startTime,
        endTime: trans?.endTime,
      };
    });
    this.basicShiftForm = this.fb.group({
      id: [''],
      shopId: ['', ValidatorService.required],
      name: ['', [ValidatorService.required, Validators.maxLength(30)]],
      startTime: ['', [ValidatorService.required]],
      endTime: ['', [ValidatorService.required, ValidatorService.isGteDate('startTime', true)]],
      updatedAt: [''],
    });
  }

  /**
   * 確認を送信
   */
  handleConfirm(event) {
    const obj: BasicShift = this.parserObj(this.basicShiftForm.value);

    // 更新
    if (event.name === 'update') {
      this.basicShiftService.updateBasicShift(String(this.shopId), [obj], this.basicShiftId).subscribe((res) => {
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
      this.basicShiftService
        .deleteBasicShift(String(this.shopId), String(this.basicShiftId))
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
    if (!this.basicShiftForm.valid) {
      return;
    }
    if (this.basicShiftForm.value.startTime >= this.basicShiftForm.value.endTime) {
      return;
    }
    const obj: BasicShift = this.parserObj(this.basicShiftForm.value);
    this.basicShiftService.createBasicShift(String(this.shopId), [obj]).subscribe((res) => {
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
    if (!this.basicShiftForm.valid) {
      return;
    }
    if (this.basicShiftForm.value.startTime >= this.basicShiftForm.value.endTime) {
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
  parserObj(obj: any): BasicShift {
    return {
      id: obj.id,
      shop_id: this.shopId,
      name: obj.name,
      start_time: obj.startTime,
      end_time: obj.endTime,
      updated_at: obj.updatedAt,
      sort: obj.sort ? obj.sort : null,
    };
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.basicShiftForm.reset();
    this.confirm.emit({open: false});
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.basicShiftForm.controls;
  }
  get v() {
    return this.basicShiftForm.value;
  }
}
