import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { ModalService, ValidatorService } from 'src/app/core/services';
import { FreeAnswerService, FreeItemService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-free-items',
  templateUrl: './free-items.component.html',
  styleUrls: ['./free-items.component.scss']
})
export class FreeItemsComponent implements OnChanges {
  @Input() userLogin;
  @Input() paramMapId;
  freeItemList: any[] = [];
  answerList: any[] = [];
  submitted = false;
  formMap
  form: FormGroup;
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  constructor(
    private freeItemService: FreeItemService,
    private freeAnswerService: FreeAnswerService,
    private modalService: ModalService,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,) {
      this.form = this.fb.group({
        answer: ['', ValidatorService.required],
      });
      this.translate.get('customer.answer').subscribe((trans) => {
        this.formMap = {
          answer: trans,
        };
      });
     }
  async ngOnChanges(): Promise<void> {
    if (this.userLogin !== undefined) {
      this.freeItemList = await this.freeItemService.getFreeItemList(this.userLogin.company_id).toPromise();
      this.freeItemList = this.freeItemList.map(qes => {
        qes.result = '';
        qes.answer = qes.answer === null ? '' : qes.answer;
        if (qes.html_type === '1' && qes.multiple_flg !== '0' && qes.answer != '') {
          qes.answer = qes.answer.split(",");
          if (qes.multiple_flg == '2') {
            qes.result = qes.answer.map((x) => false);
          }
        }
        return qes;
      });
      if (this.paramMapId !== undefined && this.paramMapId !== null) {
        this.answerList = await this.freeAnswerService.getFreeAnswerList(this.paramMapId).toPromise();
        if (this.answerList.length > 0) {
          this.freeItemList.forEach(qes => {
            this.answerList.forEach(ans => {
              if (qes.id === ans.question_id) {
                qes.result = JSON.parse(ans.answer);
                if (qes.html_type === '1' && qes.multiple_flg == '2') {
                  qes.result = qes.answer.map(item => {
                    if (JSON.parse(ans.answer).indexOf(item) != -1) {
                      return true;
                    }
                    return false;
                  });
                }
              }
            });
          })
        }
      }
    }
  }

  /**
   * Create / Update free_item
   */
  submitForm() {
    this.submitted = true;
    let error = false;
    let arr: any[] = [];
    this.form.controls.answer.setValue('answer');
    for(let res of this.freeItemList) {
      let answer = res.result;
      if (res.html_type === '1' && res.multiple_flg == '2') {
        answer = res.result.map((x, i) => x ? res.answer[i] : null).filter(x => x !== null).join(', ');
      }
      if (answer == '') {
        this.form.controls.answer.setValue('');
        return error = true;
      }
      const item = {
        customer_id: this.paramMapId,
        question_id: res.id,
        answer: answer,
        updated_at: null
      }
      arr.push(item);
    };
    if (error || this.paramMapId == null) {
      return;
    }
    if (this.answerList.length > 0) {
      // update
      this.freeAnswerService.updateFreeAnswerList(this.paramMapId, arr).subscribe((res) => {
        this.translate.get('msgCompleted.updateHasBeenCompleted').subscribe((msg: string) => {
          this.modalService.open(msg);
        });
      }, (error) => {
        this.modalService.open(error);
      });
    } else {
      // create
      this.freeAnswerService
        .createFreeAnswer(this.paramMapId, arr).subscribe((res) => {
          this.translate.get('msgCompleted.registrationHasBeenCompleted').subscribe((msg: string) => {
            this.modalService.open(msg);
          });
        }, (error) => {
          this.modalService.open(error);
        });
    }
  }

  /**
   * Change router
   */
  changeRouter() {
    this.router.navigate(['shops/customer-info']);
  }
}
