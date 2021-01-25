import {Component, ContentChild, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {ConfirmModalComponent} from 'src/app/core/directives/confirm-modal.component';
import {AuthService, ModalService, ValidatorService} from 'src/app/core/services';
import {ShopMailService} from 'src/app/core/services/apis';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-reservation-completion-email-setting',
  templateUrl: './reservation-completion-email-setting.component.html',
  styleUrls: ['./reservation-completion-email-setting.component.scss']
})
export class ReservationCompletionEmailSettingComponent implements OnInit {
  userLogin;
  isSubmit = false;
  mailForm: FormGroup;
  formMap: object;
  positionCursor = 0;
  public flag = false;
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  @ViewChild('textareaBody') textareaBody: ElementRef;
  public status = '';
  constructor(
    private shopMailService: ShopMailService,
    private authService: AuthService,
    private modalService: ModalService,
    private transService: TranslateService,
    private router: Router,
    private fb: FormBuilder) {
  }

  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.transService.get('button').subscribe((trans) => {
      this.status = trans.next;
    });
    this.transService.get('shopMail').subscribe((trans) => {
      this.formMap = {
        subject: trans?.subject,
        body: trans?.text,
      };
    });
    this.mailForm = this.fb.group({
      id: [''],
      shop_id: [''],
      subject: ['', [
        ValidatorService.required,
        ValidatorService.maxLength(30),
      ]],
      body: ['', [
        ValidatorService.required,
      ]],
      updated_at: ['']
    });
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    const shopMail = await this.shopMailService.getShopMailList(this.userLogin.shop_id).toPromise();

    if (shopMail.length > 0) {
      this.flag = true;
      this.transService.get('common').subscribe((trans) => {
      this.status = trans.update;
    });
      this.mailForm.patchValue(shopMail[0]);
    }
  }

  getPosition(e){
    if (e.selectionStart || e.selectionStart == '0') {
      this.positionCursor =  Number(e.selectionStart);
  }
}
  /**
   * submit shop_mail
   */
  submitShopMail(): void {
    this.isSubmit = true;
    if (!this.mailForm.valid) {
      return;
    }

    if (this.mailForm.controls.id.value != null && this.mailForm.controls.id.value !== '') {
      this.shopMailService.updateShopMail(this.userLogin.shop_id, this.mailForm.getRawValue()).subscribe(
        (res) => {
         // this.router.navigate(['/reservation-setting/step-8']);
        }, (error) => {
          this.modalService.open(error);
        }
      );
    } else {
      this.mailForm.controls.shop_id.setValue(this.userLogin.shop_id);
      this.shopMailService.createShopMail(this.userLogin.shop_id, this.mailForm.getRawValue()).subscribe(
        (res) => {
          this.router.navigate(['/reservation-setting/step-8']);
        }, (error) => {
          this.modalService.open(error);
        }
      );
    }
  }

  /**
   * Add character for text
   */
  addCharacter(e): void {
    let content = this.mailForm.controls.body.value;
    if(this.positionCursor==0){
      if(content)
      content=content+'\n';
    switch (e.target.id) {
      case 'name':
        {
        this.mailForm.controls.body.setValue('{$name}'+content);
        this.positionCursor+= '{$name}'.length;
        break;
        }
      case 'reservationDateTime':
      {  this.mailForm.controls.body.setValue('{$reservation_time}'+content );
        this.positionCursor+= '{$reservation_time}'.length;
        break;}
      case 'reservationMenu':
       { this.mailForm.controls.body.setValue( '{$menu_name}'+content);
       this.positionCursor+= '{$menu_name}'.length;
        break;}
      case 'information':
       { this.mailForm.controls.body.setValue('{$information}'+content);
       this.positionCursor+= '{$information}'.length;
        break;}
      case 'staffName':
       { this.mailForm.controls.body.setValue('{$staff_name}'+content);
       this.positionCursor+= '{$staff_name}'.length;
        break;}
      case 'storeName':
        {this.mailForm.controls.body.setValue('{$shop_name}'+content);
        this.positionCursor+= '{$shop_name}'.length;
        break;}
      case 'storeAddress':
      {  this.mailForm.controls.body.setValue('{$shop_address}'+content );
      this.positionCursor+= '{$shop_address}'.length;
        break;}
      case 'storePhoneNumber':
        {this.mailForm.controls.body.setValue('{$shop_tel}'+content);
        this.positionCursor+= '{$shop_tel}'.length;
        break;}
    }
    }
    else{ 
      let left =  this.mailForm.controls.body.value.substring(0,this.positionCursor);
      let right =  this.mailForm.controls.body.value.substring(this.positionCursor,content.length);
        if(content)
        content=content+'\n';
      switch (e.target.id) {
        case 'name':
          {
          this.mailForm.controls.body.setValue(left + '{$name}'+right);
          this.positionCursor+= '{$name}'.length;
          break;
          }
        case 'reservationDateTime':
        {  this.mailForm.controls.body.setValue(left  + '{$reservation_time}'+right);
          this.positionCursor+= '{$reservation_time}'.length;
          break;}
        case 'reservationMenu':
         { this.mailForm.controls.body.setValue(left  + '{$menu_name}'+right);
         this.positionCursor+= '{$menu_name}'.length;
          break;}
        case 'information':
         { this.mailForm.controls.body.setValue(left  + '{$information}'+right);
         this.positionCursor+= '{$information}'.length;
          break;}
        case 'staffName':
         { this.mailForm.controls.body.setValue(left  + '{$staff_name}'+right);
         this.positionCursor+= '{$staff_name}'.length;
          break;}
        case 'storeName':
         { this.mailForm.controls.body.setValue(left  + '{$shop_name}'+right);
         this.positionCursor+= '{$shop_name}'.length;
          break;}
        case 'storeAddress':
         { this.mailForm.controls.body.setValue(left  + '{$shop_address}'+right);
         this.positionCursor+= '{$shop_address}'.length;
          break;}
        case 'storePhoneNumber':
         { this.mailForm.controls.body.setValue(left  + '{$shop_tel}'+right);
         this.positionCursor+= '{$shop_tel}'.length;
          break;}
      }
    }
    }
}
