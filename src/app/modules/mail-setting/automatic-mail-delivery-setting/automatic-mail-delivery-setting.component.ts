import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { AuthService, ModalService, ValidatorService } from 'src/app/core/services';
import { AutoMailService } from 'src/app/core/services/apis';
import { Helper } from 'src/app/core/utils/helper';
import { LocalTime } from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-automatic-mail-delivery-setting',
  templateUrl: './automatic-mail-delivery-setting.component.html',
  styleUrls: ['./automatic-mail-delivery-setting.component.scss']
})
export class AutomaticMailDeliverySettingComponent implements OnInit {

  deliveryCondition = '0';
  mailForm: FormGroup;
  userLogin;
  isSubmit = false;
  formMap: object;
  public transmissionTimeList: any[] = Helper.generateTimeForShop(24);

  @ViewChild('textareaBody') textareaBody: ElementRef;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private autoMailService: AutoMailService,
    private transService: TranslateService,
    private modalService: ModalService,
    private router: Router,
  ) {}

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.transService.get('shopMail').subscribe((trans) => {
      this.formMap = {
        subject: trans?.subject,
        body: trans?.text,
        transmission_time: trans?.transmissionTime,
      };
    });
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.mailForm = this.fb.group({
      days: [0],
      transmission_time: ['', ValidatorService.selectRequired],
      subject: ['', [
        ValidatorService.required,
        ValidatorService.maxLength(10),
      ]],
      body: ['', [
        ValidatorService.required,
      ]],
    });
  }

  /**
   * Add character for text
   */
  addCharacter(e): void {
    const content = this.mailForm.controls.body.value;
    switch (e.target.id) {
      case 'name':
        this.mailForm.controls.body.setValue(content + '{$name}');
        break;
      case 'shopName':
        this.mailForm.controls.body.setValue(content + '{$shop_name}');
        break;
      case 'shopAddress':
        this.mailForm.controls.body.setValue(content + '{$shop_address}');
        break;
      case 'shopTel':
        this.mailForm.controls.body.setValue(content + '{$shop_tel}');
        break;
      case 'reservationTime':
        this.mailForm.controls.body.setValue(content + '{$reservation_time}');
        break;
      case 'menuName':
        this.mailForm.controls.body.setValue(content + '{$menu_name}');
        break;
      case 'staffName':
        this.mailForm.controls.body.setValue(content + '{$staff_name}');
        break;
    }
    this.textareaBody.nativeElement.focus();
  }

  /**
   * Submit auto mail & Go to next screen
   */
  nextPage() {
    this.isSubmit = true;
    if (!this.mailForm.valid) {
      return;
    }

    let autoMail = this.mailForm.getRawValue();
    autoMail.mail_type = this.deliveryCondition;

    this.autoMailService.createAutoMail(autoMail).subscribe(
      () => {
        //TODO go to next page
        // this.router.navigate(['/...']);
      }, (error) => {
        this.modalService.open(error);
    });
  }

  /**
   * Go back to previous screen
   */
  goBack() {
    this.router.navigate(['/mail-setting']);
  }
}
