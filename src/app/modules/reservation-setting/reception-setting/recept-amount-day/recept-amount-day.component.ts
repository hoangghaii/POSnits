import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ValidatorService } from 'src/app/core/services';
/**
 * レシピ日コンポーネント
 * ReceptAmountDayComponents
 */
@Component({
  selector: 'app-recept-amount-day',
  templateUrl: './recept-amount-day.component.html',
  styleUrls: ['./recept-amount-day.component.scss']
})
export class ReceptAmountDayComponent implements OnInit,OnChanges {
  public formRecept : FormGroup;
  @Input() open : boolean;
  @Input() selectCurrent : any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  public submitted = false;
  public listDateChoice = [];
  formMap;
  constructor(
    private fb : FormBuilder,
    private translate : TranslateService
  ) { }
  ngOnChanges(): void {
    if(this.selectCurrent){
      this.listDateChoice = [];
      this.listDateChoice.push(this.selectCurrent.day);
        this.formRecept.patchValue({
          reserv_recept_id : this.selectCurrent.reserv_recept_id,
          day :this.selectCurrent.day,
          amount :this.selectCurrent.amount,
          updated_at:this.selectCurrent.updated_at,
          created_at:this.selectCurrent.created_at,
          id:this.selectCurrent.id
        })
    }
  }

  ngOnInit(): void {
    this.initForm();
  }
  /**
   * 初期化フォーム
   */
  initForm(){
    this.translate.get('receptAmountDay').subscribe((trans) => {
      this.formMap=
      {
        day:trans.day,
        amount: trans.acceptNumber
      }

    });
    this.formRecept = this.fb.group({
      reserv_recept_id : [''],
      day :['',[ValidatorService.required]],
      amount :[0,[ValidatorService.required,ValidatorService.isNumber,
        ValidatorService.min(1),
        ValidatorService.maxLength(11)]],
      updated_at:[''],
      created_at:[''],
      id:['']
    })
  }
  /**
   * モーダルを閉じる
   */
  closeModal(){
    this.confirm.emit({ open: false });
    this.initForm();
    this.listDateChoice = [];
  }
  /**
   * 選択日
   * @param day 
   */
  choiceDate(day){
    this.formRecept.patchValue({
      day : day
    })
  }
  get f(){
    return this.formRecept.controls;
  }
  /**
   * 処理する
   */
  process(){
    this.submitted = true;
    if(!this.formRecept.valid)
      return;
    const obj = this.parseObj(this.formRecept.value);
    this.initForm();
    this.confirm.emit({ open: false,data:obj });
  }
  /**
   * オブジェクトを解析します
   * @param obj 
   */
  parseObj(obj){
    return {
      id : obj.id,
      day : obj.day,
      amount: obj.amount,
      updated_at : obj.updated_at,
      created_at: obj.created_at,
      reserv_recept_id :obj.reserv_recept_id,
    }
  }
}
