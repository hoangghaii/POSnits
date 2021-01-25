import { FreeItemService } from 'src/app/core/services/apis';
import { InputItemSettingService } from 'src/app/core/services/apis';
import { Constants } from 'src/app/constants/constants';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService, ValidatorService } from 'src/app/core/services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-input-item-setting',
  templateUrl: './input-item-setting.component.html',
  styleUrls: ['./input-item-setting.component.scss'],
})
export class InputItemSettingComponent implements OnInit {
  @ViewChild('appendflex') myDivElementRef: ElementRef;
  submitted: boolean;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private inputItemSettingService: InputItemSettingService,
    private freeItemService: FreeItemService,
    private router :Router
  ) {}
  shopId;
  companyId;
  updateKana = false;
  updateSex = false;
  updateBirthday = false;
  updateAddress = false;
  inputItemList = [];
  listViewFlg = Constants.viewFlg;
  listRequiredFlg = Constants.requiredFlg;
  listDescriptionType = Constants.descriptionType;
  inputItemSettingForm: FormGroup;
  errForm: FormGroup;
  formMap;
  kanaDescription = false;
  sexDescription = false;
  birthdayDescription = false;
  addressDescription = false;
  freeDescription = false;
  freeQuestionList = [];
  listQuestionToAddForm = [];
  shopCustomerInfomationItemType = Constants.shopCustomerInfomationItemType;
  isCreate = true;
  public userLogin : any;
  async ngOnInit(): Promise<void> {
    this.initForm();
   this.userLogin= await this.authService.getCurrentUser().toPromise();
    await this.getInputItemList();
    await this.getFreeQuestionList();
  }
  /**
   * 初期化フォーム
   */
  initForm() {
    this.translate.get('inputItemSetting').subscribe((trans) => {
      this.formMap = {
        viewFlg: trans?.viewFlg,
        requiredFlg: trans?.requiredFlg,
      };
    });
    this.inputItemSettingForm = this.fb.group({
      items: this.fb.array([]),
    });
  }
  /**
   * Get staffs form
   */
  get items(): FormArray {
    return this.inputItemSettingForm.get('items') as FormArray;
  }
  /**
   * Add child form from list question
   */
  addQuestionInputItemForm(question): FormGroup {
    const questionForm = this.fb.group({
      id: [null],
      shopId: [this.userLogin.shop_id],
      name: [question.question],
      itemType: ['4'],
      viewFlg: [null, ValidatorService.selectRequired],
      requiredFlg: [null, ValidatorService.selectRequired],
      descriptionType: [null],
      description: [null, ValidatorService.maxLength(225)],
      freeQuestionId: [question.id],
      updatedAt: [''],
    });
    return questionForm;
  }
  /**
   * Add child form list input item
   */
  addNormalInputItemForm(item): FormGroup {
    let name = '';
    this.shopCustomerInfomationItemType.forEach((type) => {
      if (item.item_type == type.value) name = type.key;
    });
    this.freeQuestionList.forEach((i) => {
      if (i.id == item.free_question_id) {
        name = i.question;
      }
    });
    const questionForm = this.fb.group({
      id: [item.id],
      shopId: [item.shop_id],
      name: [name],
      itemType: [item.item_type],
      viewFlg: [item.view_flg, ValidatorService.selectRequired],
      requiredFlg: [item.required_flg, ValidatorService.selectRequired],
      descriptionType: [item.description_type],
      description: [item.description, ValidatorService.maxLength(225)],
      freeQuestionId: [item.free_question_id],
      updatedAt: [item.updated_at],
    });
    return questionForm;
  }
  /**
   * Add child form default list
   */
  addOtherInputItemForm(item): FormGroup {
    const questionForm = this.fb.group({
      id: [null],
      shopId: [this.userLogin.shop_id],
      itemType: [item.value],
      name: [item.key],
      viewFlg: [null, ValidatorService.selectRequired],
      requiredFlg: [null, ValidatorService.selectRequired],
      descriptionType: [null],
      description: [null, ValidatorService.maxLength(225)],
      freeQuestionId: [null],
      updatedAt: [''],
    });
    return questionForm;
  }
  /**
   * append description
   */
  appendDescription(name: string) {
    let i = '.a' + name;
    let div = this.myDivElementRef.nativeElement.querySelector(i);
    if (
      div.style.cssText == 'display: flex !important;' ||
      div.style.display == ''
    ) {
      div.style = 'display: none !important';
    } else div.style = 'display: flex !important';
  }
  /**
   * handled submit
   */
  handledSubmit() {
    this.submitted = true;
    if (!this.inputItemSettingForm.valid) {
      const itemForm = this.inputItemSettingForm.get('items') as FormArray;
      for (const st of itemForm.controls) {
        if (st.invalid || st.dirty) {
          this.errForm = st as FormGroup;
        }
      }
      return;
    }
    let listCreate = [];
    let listUpdate = [];
    let listValue = this.inputItemSettingForm.value.items;
    listValue.forEach((element) => {
      if (element.id == null) {
        let item = {
          id: null,
          shop_id: this.userLogin.shop_id,
          name: element.name,
          item_type: element.itemType,
          view_flg: element.viewFlg,
          required_flg: element.requiredFlg,
          description: element.description,
          description_type: element.descriptionType,
          free_question_id: element.freeQuestionId,
          updated_at: null,
        };
        listCreate.push(item);
      } else {
        let item = {
          id: element.id,
          name: element.name,
          shop_id: element.shopId,
          item_type: element.itemType,
          view_flg: element.viewFlg,
          required_flg: element.requiredFlg,
          description: element.description,
          description_type: element.descriptionType,
          free_question_id: element.freeQuestionId,
          updated_at: element.updatedAt,
        };
        listUpdate.push(item);
      }
    });

    if (listCreate.length > 0)
      this.inputItemSettingService
        .createInputItemSetting(this.userLogin.shop_id, listCreate)
        .subscribe((res) => {
          this.submitted = false;
          this.inputItemSettingForm = this.fb.group({
            items: this.fb.array([]),
          });
          this.inputItemList = res;
          this.inputItemList.forEach((item) => {
            const forms = this.inputItemSettingForm.get('items') as FormArray;
            forms.push(this.addNormalInputItemForm(item));
          });
        });
    if (listUpdate.length > 0)
      this.inputItemSettingService
        .updateInputItemSettings(this.userLogin.shop_id, listUpdate)
        .subscribe((res) => {
          this.submitted = false;
          this.inputItemSettingForm = this.fb.group({
            items: this.fb.array([]),
          });
          this.inputItemList = res;
          this.inputItemList.forEach((item) => {
            const forms = this.inputItemSettingForm.get('items') as FormArray;
            forms.push(this.addNormalInputItemForm(item));
          });
        });
        this.initForm();
      this.router.navigateByUrl('/reservations');
    
  }
  /**
   * Gets input item list
   */
  getInputItemList() {
    this.inputItemSettingService
      .getInputItemSettingList(this.userLogin.shop_id)
      .subscribe((res) => {
        this.inputItemList = res;
        if (res.length == 0) {
          this.shopCustomerInfomationItemType.forEach((type) => {
            const forms = this.inputItemSettingForm.get('items') as FormArray;
            forms.push(this.addOtherInputItemForm(type));
          });
        }
      });
  }
  /**
   * Gets free question list
   */
  getFreeQuestionList() {
    this.freeItemService.getFreeItemList( this.userLogin.company_id).subscribe((res) => {
      this.freeQuestionList = res;
      this.listQuestionToAddForm = this.freeQuestionList;
      this.inputItemList.forEach((item) => {
        const forms = this.inputItemSettingForm.get('items') as FormArray;
        forms.push(this.addNormalInputItemForm(item));
      });
      this.inputItemList.forEach((item) => {
        this.listQuestionToAddForm = this.listQuestionToAddForm.filter(
          (i) => i.id != item.free_question_id
        );
      });
      this.listQuestionToAddForm.forEach((item) => {
        const forms = this.inputItemSettingForm.get('items') as FormArray;
        forms.push(this.addQuestionInputItemForm(item));
      });
    });
  }
}
