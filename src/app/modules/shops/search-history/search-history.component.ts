import { AuthService } from './../../../core/services/auth.service';
import {  ReservationService } from 'src/app/core/services/apis';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from 'src/app/core/services';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { LocalTime } from 'src/app/core/utils/local-time';
import { ConditionalSearchService } from 'src/app/core/services/apis/conditional-search.service';

@Component({
  selector: 'app-search-history',
  templateUrl: './search-history.component.html',
  styleUrls: ['./search-history.component.scss'],
})
export class SearchHistoryComponent implements OnInit {
  localTime = LocalTime;
  listSearch = [];
  userLogin;
  shopId;
  searchId;
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  constructor(
    private conditionalSearchService: ConditionalSearchService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router,
    private modalService: ModalService,
    private reservationService :ReservationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    this.listSearch = await this.getListSearch();
    await this.getMenu();
    
  }
  async getMenu() :Promise<void>{
    this.listSearch = this.listSearch.sort((a, b) => {
      return <any>new Date(b.updated_at) - <any>new Date(a.updated_at);
      });
      await this.listSearch.forEach(async element => {
        if(element.menus)
          element.menus= await this.reservationService.getListMenusByListId(this.shopId,element.menus).toPromise();
        else
          element.menus = [];
      });
  }
  /**
   * Gets list search
   */
  async getListSearch():Promise<any[]> {
    return  this.conditionalSearchService
                   .getSearchResultList(this.userLogin.shop_id).toPromise();
   }
    /**
   * 削除
   */
  handleDelete(id): void {
    this.searchId = id;
    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
  }
  /**
   * Handles edit
   * @param id 
   */
  handleEdit(id) {
    this.conditionalSearchService.id = id;
    this.router.navigate(['shops/conditional-search']);
  }
  /**
   * 確認を送信
   */
  async handleConfirm(event): Promise<void> {
    if (event.name === 'delete') {
      this.conditionalSearchService
        .deleteSearchResult(
          String(this.userLogin.shop_id),
          String(this.searchId)
        )
        .subscribe((res) => {
          this.translate
            .get('msgCompleted.deletetionHasBeenCompleted')
            .subscribe((msg: string) => {
              this.modalService.open(msg);
              
            });
        });
        this.listSearch = await this.getListSearch();
    }
    await this.getMenu();
  }
  checkObj(obj){
    return typeof(obj);
  }
}
