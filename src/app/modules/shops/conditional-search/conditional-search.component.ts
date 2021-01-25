import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { AuthService, ValidatorService } from 'src/app/core/services';
import { MenuReserveService, ReservationService } from 'src/app/core/services/apis';
import { ConditionalSearchService } from 'src/app/core/services/apis/conditional-search.service';
/**
 * ConditionalSearchComponent
 * 条件付き検索コンポーネント
 */
@Component({
  selector: 'app-conditional-search',
  templateUrl: './conditional-search.component.html',
  styleUrls: ['./conditional-search.component.scss']
})
export class ConditionalSearchComponent implements OnInit {
  public submitted = false;
  public isOpen = false;
  public listMenu = [];
  public userLogin : any;
  public conditionalSearchForm: FormGroup;
  public list: FormArray;
  public day_types = Constants.day_type;
  public sex_types = Constants.sex_type;
  public visit_amount_types = Constants.visit_amount_type;
  public sale_types = Constants.sale_type;
  public menu_select_types = Constants.menu_select_type;
  public idInput :any;
  public data :any;
  formMap: object;
  /**
   * 
   * @param menuService 
   * @param translate 
   * @param authService 
   * @param fb 
   * @param router 
   * @param resultService 
   */
  constructor(
    private  menuService : MenuReserveService,
    private translate: TranslateService,
    private authService : AuthService,
    private fb : FormBuilder,
    private router : Router,
    private resultService : ConditionalSearchService,
    private reservationService :ReservationService,
    private conditionalService :ConditionalSearchService,
    private menuServiece :MenuReserveService
  ) {
   
   }

  async ngOnInit(): Promise<void>{
    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    if(this.conditionalService.id){
      this.data = await this.resultService.getSearchResult(this.userLogin.shop_id,this.conditionalService.id.toString()).toPromise();
      this.patchValue(this.data);
    }
  }
  /**
   * 初期化フォーム
   */
  initForm() {
    this.translate.get('conditionalSearch').subscribe((trans) => {
      this.formMap = {
        age_from: trans?.age,
        age_to: trans?.age,
        visit_amount_from: trans?.visit,
        visit_amount_to: trans?.visit,
        sale_from: trans?.sale,
        sale_to: trans?.sale,
      };
    });
   this.conditionalSearchForm = this.fb.group({
    listMenus: this.fb.array([]),
    day_types : ['0'],
    sex_types :['0'],
    visit_amount_types:['0'],
    sale_types:['0'],
    menu_select_types:['0'],
    target_day_from :[''],
    target_day_to:[''],
    birthday_from:[''],
    birthday_to:[''],
    age_from:['',  ValidatorService.isNumber],
    age_to:[ '', ValidatorService.isNumber,],
    visit_amount_from:[ '', ValidatorService.isNumber,],
    visit_amount_to:['',  ValidatorService.isNumber,],
    sale_from :[ '', ValidatorService.isNumber,],
    sale_to:[ '', ValidatorService.isNumber,],
    menus:[''],
    updated_at:[''],
    id:[''],
    result_amount:['0']
   });
  }
   /**
   * Open register
   */
  openModal(status?: string): void {
    this.menuService.listMenu = this.listMenu;
    this.isOpen = true;
  }

  /**
   * Close modal
   */
  async closeModal(event: any): Promise<void> {
    this.listMenu = this.menuService.listMenu;
    if(this.listMenu){
      this.listMenu.forEach(item=>{
        this.addMenu();
      })
    }
    this.isOpen = event.open;
  }/**
   * パッチ値
   * @param data 
   */
 async patchValue(data:any):Promise<void>{
    if(data[0].menus){ 
      this.listMenu = await  this.reservationService.getListMenusByListId(this.userLogin.shop_id,data[0].menus).toPromise(); 
      this.listMenu.forEach(item=>{
          this.addMenu();
        })
      this.menuService.listMenu = this.listMenu;
      }
      this.conditionalSearchForm.patchValue({
      day_types  : data[0].day_type || '',
      sex_types  : data[0].sex_type|| '' ,
      visit_amount_types  : data[0].visit_amount_type || '',
      sale_types  : data[0].sale_type || '',
      menu_select_types  : data[0].menu_select_type || '',
      target_day_from  : data[0].target_day_from || '',
      target_day_to  : data[0].target_day_to || '',
      birthday_from  : data[0].birthday_from || '',
      birthday_to  : data[0].birthday_to || '',
      visit_amount_from  : data[0].visit_amount_from|| '' ,
      visit_amount_to  : data[0].visit_amount_to || '',
      sale_from  : data[0].sale_from || '',
      sale_to  : data[0]  .sale_to || '',
      age_from : data[0] .age_from|| '',
      age_to : data[0] .age_to|| '',
      updated_at : data[0] .updated_at|| '',
      result_amount :  data[0] .result_amount|| '',
      listMenus:this.listMenu||'',
      id:data[0].id||'',
    })
   
    if(this.listMenu.length>0)
      this.conditionalSearchForm.patchValue({
        listMenus:this.listMenu,
        menus : this.listMenu
      })
  
  }
  /**
   * メニューを追加
   */
  addMenu() {
  
      this.list = this.conditionalSearchForm.controls['listMenus'] as FormArray;
       let form = this.createMenuForm();
       this.list.push(form);
  }
  /**
   * メニューフォームを作成する
   */
  createMenuForm() {
    return this.fb.group({
      id: [''],
      coupon_id: [''],
      category_cd: [''],
      menu_id: [''],
      price: [''],
      updated_at: [''],
    });
  }
  get f() {
    return this.conditionalSearchForm.controls;
  }
  /**
   * アイテムを削除
   * @param item 
   */
  deleteItem(item : any){
    let listUpdate = [];
   this.listMenu.forEach(element=>{
     if(JSON.stringify(item) != JSON.stringify(element))  
     listUpdate.push(element);
   });
   this.listMenu = listUpdate;   
  }
  /**
   * 登録
   */
 async  register():Promise<void>{
    this.submitted = true;
    if (!this.conditionalSearchForm.valid) {
      return;
    }
    let  id :string;
    let body = await this.parseObject(this.conditionalSearchForm.value);
    this.conditionalService.listResult = await this.getResult(body);
   
    body['result_amount'] = this.conditionalService.listResult.length;
    let list  = [];
    list.push(body);
    if(body['id']){
      await this.conditionalService.updateSearchResult(this.userLogin.shop_id,list).toPromise().then(res=>{
        this.conditionalService.id = res[0].id;
      });
    }
    else{
      await this.conditionalService.createSearchResult(this.userLogin.shop_id,list).toPromise().then(res=>{
        this.conditionalService.id = res[0].id;
      });
    }
    this.router.navigate(['shops/list-result']);
    this.submitted = false;
    this.initForm();
  }
  /**
   * オブジェクトを解析します
   * @param obj 
   */
  async parseObject(obj: any):Promise<Object>{
    return {
      shopId:this.userLogin.shop_id,
      day_type : obj.day_types,
      sex_type : obj.sex_types,
      visit_amount_type : obj.visit_amount_types,
      sale_type : obj.sale_types,
      menu_select_type : obj.menu_select_types,
      target_day_from : obj.target_day_from,
      target_day_to : obj.target_day_to,
      birthday_from : obj.birthday_from,
      birthday_to : obj.birthday_to,
      age_from : obj.age_from,
      age_to : obj.age_to,
      visit_amount_from : obj.visit_amount_from,
      visit_amount_to : obj.visit_amount_to,
      sale_from : obj.sale_from,
      sale_to : obj.sale_to,
      menus : await this.parseListMenu(this.listMenu),
      id : obj.id,
      updated_at : obj.updated_at,
      result_amount : obj.result_amount
    }
  }
  /**
   * リストメニューの解析
   * @param listMenu 
   */
 async parseListMenu(listMenu:any[]):Promise<string>{
    if(this.conditionalSearchForm.value.menu_select_types=='0'){
      let list = await this.getListMenu();
      let menus = [];
      list.forEach(element => {
        if(element['details'].length>0){
            element['details'].forEach(item => {
              let obj = {
                menu_id:item.id,
                category_cd:item.category_cd
              }
              menus.push(obj);
        });
      }
      });
      if(menus.length>0) return JSON.stringify(menus);
      else 
        return '';
    }
    else{
      if(listMenu.length>0){
        let menus = [];
        listMenu.forEach(item=>{
          let obj = {
            class_id:item.idParent,
            menu_id:item.id,
            category_cd:item.category_cd
          }
          menus.push(obj);
        });
        return JSON.stringify(menus);
      }
    }
    
    return '';
  }
  /**
   * メニューに戻る
   */
  backToMenu(){
    this.router.navigate(['/setting']);
    this.initForm();  
  }
  /**
   * リストメニューを取得
   */
  async getListMenu(): Promise<any[]> {
    return await this.menuServiece
      .getListReserveMenu(this.userLogin.shop_id)
      .toPromise();
  }
  toScreenHistory(){
    this.router.navigate(['/shops/search-history']);
  }
  async getResult(res) : Promise<any[]>{
    return await this.conditionalService.getResult(
      this.userLogin.shop_id,
      res['day_type']||'',
      res['target_day_from']||'',
      res['target_day_to']||'',
      res['birthday_from']||'',
      res['birthday_to']||'',
      res['age_from']||'',
      res['age_to']||'',
      res['sex_type']||'',
      res['visit_amount_from']||'',
      res['visit_amount_to']||'',
      res['visit_amount_type']||'',
      res['sale_from']||'',
      res['sale_to']||'',
      res['sale_type']||'',
      res['menus']||'',
      res['menu_select_type']||'',
    ).toPromise();
  }
}
