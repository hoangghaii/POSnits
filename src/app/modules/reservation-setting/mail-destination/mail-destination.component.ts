import {Component, ElementRef, OnChanges, OnInit, Renderer2, SimpleChanges, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from 'src/app/core/services';
import {MailDestinationService} from 'src/app/core/services/apis/mail-destination.service';

/**
 * MailDestinationComponent
 * メールの宛先コンポーネント
 */

@Component({
  selector: 'app-mail-destination',
  templateUrl: './mail-destination.component.html',
  styleUrls: ['./mail-destination.component.scss']
})
export class MailDestinationComponent implements OnInit {


  /**
   * オープンモーダル
   */
  public open = false;
  public listMails: any[];
  public indexRow: number = null;
  public listMailEdit: any[];
  public userLogin: any;
  public selectCurrent: any;
  public status: boolean;
  public btn = '';
  style = {};
  public flag = false;
  /**
   * コンストラクタ
   * @param fb
   * @param authService
   * @param mailService
   * @param translate
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private mailService: MailDestinationService,
    private translate: TranslateService,
    private router: Router
  ) {
  }


  /**
   * 初期表示
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.translate.get('mailDestination').subscribe(res=>{
      this.btn = res.btnNext;
    })
    this.listMails = await this.getListMails();
    if(this.listMails.length>0){
      this.flag = true;
      this.translate.get('common').subscribe(res=>{
        this.btn = res.update;
      })
    }

  }

  /**
   * メーリングリストを受け取る
   */
  async getListMails(): Promise<any[]> {
    return await this.mailService.getListMailDestination(this.userLogin.shop_id).toPromise();
  }

  /**
   * 追加と削除のステータスを確認する
   * @param e
   */
  checkStatus(e: any) {
    this.status = e;
  }

  /**
   * メーリングリストを処理するためにモーダルサイド引数を取ります
   * @param a
   */
  addItem(a: any) {
    if (this.indexRow != null && !this.status && a) {
      this.listMails[this.indexRow] = a;
    } else {
      if (!a && this.indexRow != null) {
        if (this.listMails.length > 1) {
          this.listMails[this.indexRow].name = '';
        } else {
          if (this.listMails[0].id) {
            this.listMails[0].name = '';
          } else {
            this.listMails = [];
          }
        }
      }
    }

    if (this.indexRow == null) {
      a.forEach(item => {
        this.listMails.push(item);
      });
    }
    this.indexRow = null;
  }

  /**
   * モーダルを閉じる
   * @param event
   */
  async closeModal(event: any): Promise<void> {
    this.open = event.open;
    this.createMail();
  }

  /**
   * レジスターを開く
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
      this.indexRow = null;
    }
    this.open = true;
  }

  /**
   * メールリストをサーバーに送信する
   */
  async createMail(): Promise<void> {
    this.listMails = await this.getListMails();
   if(this.listMails.length>0&&!this.flag){
    this.router.navigateByUrl('reservation-setting/step-9')
  }
  }

  /**
   * リストから行を選択します
   * @param input
   */
  selectedRow(input) {
    this.selectCurrent = input;
    this.indexRow = (this.listMails.indexOf(input));
    this.openModal('update');
  }

  /**
   * Toggle big list
   */
  toggleBigList(): void {
    const toggle = document.getElementById('toggle-bigList');
    const btnToggle = document.getElementById('btn-toggle-bigList');
    if (toggle.hasAttribute('open')) {
      toggle.removeAttribute('open');
      toggle.classList.remove('animation');
      btnToggle.classList.toggle('animation');
    } else {
      toggle.setAttribute('open', "");
      toggle.classList.toggle('animation');
      btnToggle.classList.toggle('animation');
    }
  }
}
