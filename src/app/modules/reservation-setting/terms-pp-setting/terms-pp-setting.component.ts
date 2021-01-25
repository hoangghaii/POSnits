import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {ShopTerm} from 'src/app/core/models';
import {AuthService, ModalService, ValidatorService} from 'src/app/core/services';
import {ShopTermService} from 'src/app/core/services/apis';

@Component({
  selector: 'app-terms-pp-setting',
  templateUrl: './terms-pp-setting.component.html',
  styleUrls: ['./terms-pp-setting.component.scss']
})
export class TermsPpSettingComponent implements OnInit {
  public shopId: number;
  public userLogin;
  public shopTerm = new ShopTerm();
  submitted: boolean;
  public isNew = true;
  termForm: FormGroup;
  formMap: object;
  public btn:any;
  public style={"background-color":"#ccc"};
  public flag = false;
  constructor(
    private authService: AuthService,
    private shopTermService: ShopTermService,
    private router: Router,
    private modalService: ModalService,
    private fb: FormBuilder,
    private translate: TranslateService,
  ) {
  }

  /**
   * コンポネント初期処理
   */
  async ngOnInit(): Promise<void> {

    this.initForm();
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.shopId = this.userLogin.shop_id;
    this.getShopTerm();
  }

  /**
   * Get Term & Privacy Policy
   */
  getShopTerm(): void {
    this.shopTermService.getShopTerm(this.shopId).subscribe((res) => {
      if (res.length) {
        this.flag = true;
        this.style = {"background-color":"#ff648c"};
        this.translate.get('common').subscribe((trans) => {
          this.btn = trans.update;
        });
        this.termForm.patchValue({
          id: res[0].id,
          shopId: res[0].shop_id,
          terms: res[0].terms,
          privacyPolicy: res[0].privacy_policy,
          updatedAt: res[0].updated_at,
        });
        this.isNew = false;
      }
      else{
        this.translate.get('shopTerm').subscribe((trans) => {
          this.btn = trans.next;
        });
      }
    });
  }

  /**
   * Create || Update Term & Privacy Policy
   */
  nextStep(): void {
    this.submitted = true;
    if (!this.termForm.valid) {
      return;
    }
    this.shopTerm.shop_id = this.shopId;
    const obj: any = this.parserObj(this.termForm.value);
    if (this.isNew === false) {
      this.shopTermService.updateShopTerm(this.shopId, obj).subscribe(() => {
       // this.router.navigate(['/reservation-setting/step-7']);
      }, (error) => {
        this.modalService.open(error);
      });
    } else {
      this.shopTermService.createShopTerm(this.shopId, obj).subscribe(() => {
       this.router.navigate(['/reservation-setting/step-7']);
      }, (error) => {
        this.modalService.open(error);
      });
    }
    this.getShopTerm();
    this.submitted = false;
  }

  /**
   * Init form
   */
  initForm(): void {
    this.translate.get('shopTerm').subscribe((trans) => {

      this.formMap = {
        terms: trans?.terms,
        privacyPolicy: trans?.privacyPolicy,
      };
    });
    this.termForm = this.fb.group({
      id: [''],
      shopId: [''],
      terms: ['', ValidatorService.required],
      privacyPolicy: ['', ValidatorService.required],
      updatedAt: ['']
    });
  }

  /**
   * オブジェクトの解析
   */
  parserObj(obj: any): object {
    return {
      id: obj.id,
      shop_id: this.shopId,
      terms: obj.terms,
      privacy_policy: obj.privacyPolicy,
      updated_at: obj.updatedAt,
    };
  }

  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.termForm.controls;
  }
  subUpdate():void{

    if (this.isNew === false) {
      this.submitted = true;
    }
    if (!this.termForm.valid||this.isNew === true) {
      return;
    }
    else{

      const obj: any = this.parserObj(this.termForm.value);
      this.shopTermService.updateShopTerm(this.shopId, obj).subscribe(() => {
        // this.router.navigate(['/reservation-setting/step-7']);
       }, (error) => {
         this.modalService.open(error);
       });
       this.getShopTerm();
    }
    this.submitted = false;
  }
}
