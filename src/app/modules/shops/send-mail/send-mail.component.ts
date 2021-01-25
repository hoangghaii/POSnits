import { ValidatorService } from 'src/app/core/services';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-send-mail',
  templateUrl: './send-mail.component.html',
  styleUrls: ['./send-mail.component.scss'],
})
export class SendMailComponent implements OnInit {
  public sendMailForm: FormGroup;
  submitted = false;
  formMap;
  public isOpen = false;
  public mail_type = Constants.mail_type;
  constructor(private fb: FormBuilder, 
              private translate: TranslateService,
              private router :Router) {}

  async ngOnInit(): Promise<void> {
    this.initForm();  
  }
  initForm() {
    this.translate.get('sendMail').subscribe((trans) => {
      this.formMap = {
        mailType: trans?.sendType,
        date: trans?.dateTime,
        time: trans?.dateTime,
        subject: trans?.subject,
        body: trans?.text,
      };
    });
    this.sendMailForm = this.fb.group({
      id: [''],
      mailType: ['0', ValidatorService.selectRequired],
      date: ['', ValidatorService.dateRequired],
      time: ['', ValidatorService.selectRequired],
      subject: [
        '',
        [ValidatorService.required, ValidatorService.maxLength(225)],
      ],
      body: ['', ValidatorService.required],
    });
  }
  /**
   * フォームフィールドに簡単にアクセスできる便利なゲッター
   */
  get f() {
    return this.sendMailForm.controls;
  }
  handlerSubmit() {
    this.submitted = true;
    console.log(this.sendMailForm);

    if (this.sendMailForm.invalid) {
      return;
    }
  }
  addToBody(type: string) {
    let content = this.sendMailForm.value.body;
    if(content){
      content+='\n'
    }
    switch (type) {
      case 'name':
        this.sendMailForm.patchValue({
          body:content + '{$name}',
        });
        break;
      case 'shopName':
        this.sendMailForm.patchValue({
          body:content + '{$shopName}',
        });
        break;
      case 'shopAddress':
        this.sendMailForm.patchValue({
          body:content + '{$shopAddress}',
        });
        break;
      case 'shopPhone':
        this.sendMailForm.patchValue({
          body:content + '{$shopPhone}',
        });
        break;
      case 'reservationDateTime':
        this.sendMailForm.patchValue({
          body:content + '{$reservationDateTime}',
        });
        break;
      case 'reservationMenu':
        this.sendMailForm.patchValue({
          body:content + '{$reservationMenu}',
        });
        break;
      case 'reservationStaff':
        this.sendMailForm.patchValue({
          body:content + '{$reservationStaff}',
        });
        break;
    }
  }
  openReview(){
    // if(!this.sendMailForm.controls.body.value.valid)
    //   return;
    this.isOpen =true;
  }
  async closeModal(event: any): Promise<void> {
 
    this.isOpen = event.open;
  }
  backtoList(){
    this.router.navigateByUrl('shops/list-result');
  }
}
