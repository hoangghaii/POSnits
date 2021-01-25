import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { ModalService, ValidatorService } from 'src/app/core/services';
import { ConversionSettingsService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-conversion-registration-modal',
  templateUrl: './conversion-registration-modal.component.html',
  styleUrls: ['./conversion-registration-modal.component.scss']
})
export class ConversionRegistrationModalComponent implements OnInit, OnChanges {
  /**
   * Form group
   */
  formRegister: FormGroup;

  /**
   * Check validator
   */
  submitted = false;

  /**
   * Form map item
   */
  formMap;

  @Input() userLogin: any;
  @Input() selectCurrent: any;
  @Input() open: boolean;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(
    private conversionSettingsService: ConversionSettingsService,
    private fb: FormBuilder,
    private translate: TranslateService,
    private modalService: ModalService) { }

  /**
   * Change popup
   */
  ngOnChanges(): void {
    if (this.open && this.selectCurrent) {
      this.conversionSettingsService.getShopConversion(this.selectCurrent.shop_id, this.selectCurrent.id).subscribe(res => {
        this.formRegister.patchValue({
          id: res[0].id,
          name: res[0].name,
          shopId: res[0].shop_id,
          complete: res[0].complete,
          otherComplete: res[0].other_complete,
          updatedAt: res[0].updated_at,
        });
      });
    }

    if (this.open && this.selectCurrent === null) {
      this.initForm();
      this.submitted = false;
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
    this.translate.get('conversionSettings').subscribe((trans) => {
      this.formMap = {
        name: trans?.conversionName,
        complete: trans?.completionPage,
        otherComplete: trans?.nonCompletionPages,
      };
    });
    this.formRegister = this.fb.group({
      id: [null],
      shopId: [null],
      name: ['', [ValidatorService.required]],
      complete: ['', [ValidatorService.required]],
      otherComplete: ['', ValidatorService.required],
      updatedAt: [null],
    });
  }

  /**
   * Create
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.formRegister.valid) {
      return;
    }
    const obj: any[] = [this.parserObj(this.formRegister.value)];
    this.conversionSettingsService.createShopConversion(this.userLogin.shop_id, obj).subscribe(res => {
      this.confirm.emit({ open: false, status: 'upCreate' });
      this.translate.get('conversionSettings.registrationHasBeenCompleted').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
    });
  }

  /**
   * Edit Item
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
   * Close modal
   */
  closeModal(): void {
    this.submitted = false;
    this.formRegister.reset();
    this.confirm.emit({ open: false });
  }

  /**
   * Parse obj
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: obj.shopId,
      name: obj.name,
      complete: obj.complete,
      other_complete: obj.otherComplete,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * Get form control
   */
  get f(): any {
    return this.formRegister.controls;
  }

  /**
   * Emit confirm
   */
  handleConfirm(event): void {
    const obj: any = [this.parserObj(this.formRegister.value)];
    if (event.name === 'update') {
      this.conversionSettingsService.updateShopConversion(this.userLogin.shop_id, this.formRegister.controls.id.value, obj)
        .subscribe(res => {
          this.confirm.emit({ open: false, status: 'upCreate' });
          this.translate.get('conversionSettings.updateHasBeenCompleted').subscribe((msg: string) => {
            this.modalService.open(msg);
          });
        });
    }
  }
}
