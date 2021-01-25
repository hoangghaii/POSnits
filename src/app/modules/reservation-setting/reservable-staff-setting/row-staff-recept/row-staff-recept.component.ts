import {Constants} from 'src/app/constants/constants';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from 'src/app/core/services/auth.service';
import {StaffReceptService} from 'src/app/core/services/apis';

@Component({
  selector: 'app-row-staff-recept',
  templateUrl: './row-staff-recept.component.html',
  styleUrls: ['./row-staff-recept.component.scss'],
})
export class RowStaffReceptComponent implements OnInit, OnChanges {
  public staffReceptsForm: FormGroup;
  @Input() staff;
  @Input() event = '';
  @Input() listStaffRecepts = [];
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @Output() data: EventEmitter<object> = new EventEmitter<object>(null);
  submitted: boolean;
  userLogin: any;
  listWebFlg = [];
  update = false;

  constructor(
    private fb: FormBuilder,
    private staffReceptsService: StaffReceptService,
    private authService: AuthService
  ) {
  }

  /**
   * ポップアップの変更
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.event === 'check') {
      this.checkValidate();
      this.event = '';
    }
    if (this.event === 'create') {
      const obj: any = this.parserObj(this.staffReceptsForm.value);
      this.data.emit({status: 'false', data: obj});
      this.event = '';
    }
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.listWebFlg = Constants.webFlagStaffRecepts;
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listStaffRecepts.forEach((item) => {
      if (item.staff_id == this.staff.id) {
        this.staffReceptsForm.patchValue({
          id: item.id,
          staffId: item.staff_id,
          receptAmount: item.recept_amount,
          webFlg: item.web_flg.toString(),
          nomination: item.nomination,
          updatedAt: item.updated_at,
        });
        this.update = true;
      }
    });
  }

  /**
   * 初期化フォーム
   */
  initForm(): void {
    this.staffReceptsForm = this.fb.group({
      id: [null],
      staffId: [this.staff.id],
      receptAmount: ['', [Validators.required, Validators.max(999999999999), Validators.min(0)]],
      webFlg: ['', [Validators.required, Validators.maxLength(1)]],
      nomination: ['', [Validators.required, Validators.max(999999999999), Validators.min(0)]],
      updatedAt: [''],
    });
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      staff_id: obj.staffId,
      recept_amount: obj.receptAmount,
      web_flg: obj.webFlg,
      nomination: obj.nomination,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.staffReceptsForm.controls;
  }

  /**
   * 検証を確認してください
   */
  checkValidate(): void {
    this.submitted = true;
    if (!this.staffReceptsForm.valid) {
      this.confirm.emit({status: 'false'});
    } else {
      this.confirm.emit({status: 'true'});
    }
  }
}
