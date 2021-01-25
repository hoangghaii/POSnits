import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {Constants} from 'src/app/constants/constants';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Tech} from 'src/app/core/models';
import {ColorTypeSetting, RegexValidator} from 'src/app/constants/global-const';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {TechService} from 'src/app/core/services/apis';
import {ModalService, ValidatorService} from 'src/app/core/services';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-modal-skill',
  templateUrl: './modal-skill.component.html',
  styleUrls: ['./modal-skill.component.scss']
})
export class ModalSkillComponent implements OnInit, OnChanges {
  public categoryCd: string = Constants.categoryClass.TECH;
  public addTechForm: FormGroup;
  public tech: Tech[] = [];
  public listWeb: object = Constants.listTechWeb;
  public colorValue = '';
  public currentPickedColor: string = null;
  public presetColors = ColorTypeSetting.defaultColors;
  public jaAlphabetRegex: RegExp = RegexValidator.jaAlphabetRegex;
  public numberOnlyRegex: RegExp = RegexValidator.numberOnlyRegex;
  public submitted = false;
  public defaultColor = '';
  public formMap = {
    classId: '',
    name: '',
    webFlg: '',
    treatmentTime: '',
    bufferTime: '',
    price: '',
    taxId: '',
    colorCode: '',
  };

  @Input() userLogin: any;
  @Input() open: boolean;
  @Input() selectCurrent: any;
  @Input() techClassList: any;
  @Input() listTaxes: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  /**
   * コンストラクタ
   * @param techService
   * @param techClassService
   * @param taxService
   */
  constructor(
    private techService: TechService,
    private fb: FormBuilder,
    private modalService: ModalService,
    private translate: TranslateService
  ) {
  }

  /**
   * ポップアップの変更
   */
  ngOnChanges(): void {
    this.currentPickedColor = this.defaultColor;
    if (this.open && this.selectCurrent) {
      this.techService
        .getSkill(
          String(this.selectCurrent.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res: any) => {
          this.addTechForm.patchValue({
            id: res[0].id,
            classId: res[0].class_id,
            name: res[0].name,
            treatmentTime: res[0].treatment_time,
            bufferTime: res[0].buffer_time,
            price: res[0].price,
            taxId: res[0].tax_id,
            shopId: res[0].shop_id,
            sort: res[0].sort,
            webFlg: res[0].web_flg,
            colorCode: `${res[0].color_code}`,
            updatedAt: res[0].updated_at,
          });
          this.currentPickedColor = `#${res[0].color_code}`;
        });
    }

    if (this.open && this.selectCurrent === null) {
      this.initForm();
      this.addTechForm.controls.taxId.setValue(this.listTaxes[0].id);
      this.submitted = false;
    }
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.initForm();
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.translate.get('tech').subscribe((trans) => {
      this.formMap.classId = trans?.techClassSelection;
      this.formMap.name = trans?.techName;
      this.formMap.webFlg = trans?.webFlg;
    });
    this.translate.get('common').subscribe((trans) => {
      this.formMap.treatmentTime = trans?.treatmentTime;
      this.formMap.bufferTime = trans?.bufferTime;
      this.formMap.price = trans?.tPrice;
      this.formMap.taxId = trans?.taxRate;
      this.formMap.colorCode = trans?.colorCode;
    });

    const color: string = this.defaultColor.replace('#', '');
    this.addTechForm = this.fb.group({
      id: [''],
      classId: ['', ValidatorService.selectRequired],
      categoryCd: [''],
      name: ['', [ValidatorService.required, ValidatorService.maxLength(30)]],
      treatmentTime: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      bufferTime: [
        '',
        [
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      price: [
        '',
        [
          ValidatorService.required,
          ValidatorService.isNumber,
          ValidatorService.maxLength(20),
        ],
      ],
      taxId: ['', ValidatorService.selectRequired],
      sort: ['0'],
      webFlg: ['0', ValidatorService.selectRequired],
      colorCode: [color, ValidatorService.required],
      updatedAt: [''],
    });
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.addTechForm.reset();
    this.handleResetColor();
    this.confirm.emit({open: false});
  }

  /**
   * 作成および更新
   */
  handleCreate(): void {
    this.submitted = true;
    if (!this.addTechForm.valid) {
      return;
    }

    if (this.addTechForm.controls.bufferTime.value === '') {
      this.addTechForm.controls.bufferTime.setValue(0);
    }
    const obj: any = this.parserObj(this.addTechForm.value);

    this.techService
      .createSkill(String(this.userLogin.shop_id), obj)
      .subscribe((res) => {
        this.confirm.emit({open: false, status: 'upCreate'});
        this.translate
          .get('addStaff.staffCreate.registrationHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
          });
      });
  }

  /**
   * 更新
   */
  handleUpdate(): void {
    this.submitted = true;
    if (!this.addTechForm.valid) {
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
   * 確認を送信
   */
  handleConfirm(event): void {
    const obj: any = this.parserObj(this.addTechForm.value);

    // 更新
    if (event.name === 'update') {
      this.techService
        .updateSkill(
          String(this.userLogin.shop_id),
          String(this.selectCurrent.id),
          obj
        )
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('addStaff.staffCreate.updateHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }

    // 削除
    if (event.name === 'delete') {
      this.techService
        .deleteSkill(
          String(this.userLogin.shop_id),
          String(this.selectCurrent.id)
        )
        .subscribe((res) => {
          this.confirm.emit({open: false, status: 'upCreate'});
          this.translate
            .get('addStaff.staffCreate.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
            });
        });
    }
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      class_id: obj.classId,
      name: obj.name,
      treatment_time: obj.treatmentTime,
      buffer_time: obj.bufferTime,
      price: obj.price,
      tax_id: obj.taxId,
      shop_id: obj.shopId,
      sort: obj.sort,
      web_flg: obj.webFlg,
      color_code: obj.colorCode ? obj.colorCode : this.defaultColor,
      updated_at: obj.updatedAt,
      category_cd: Constants.categoryClass.TECH,
    };
  }

  /**
   * カラーピッカーから色を取得
   * @param color
   */
  getValueColor(color: any): void {
    this.colorValue = color.replace('#', '');
    this.addTechForm.controls.colorCode.setValue(this.colorValue);
  }

  /**
   * リセットステータスと現在の選択された色を処理します
   */
  handleResetColor(): void {
    this.currentPickedColor = '';
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.addTechForm.controls;
  }
}
