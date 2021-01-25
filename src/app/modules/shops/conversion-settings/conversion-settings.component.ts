import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { AuthService, ModalService } from 'src/app/core/services';
import { ConversionSettingsService } from 'src/app/core/services/apis';

@Component({
  selector: 'app-conversion-settings',
  templateUrl: './conversion-settings.component.html',
  styleUrls: ['./conversion-settings.component.scss']
})
export class ConversionSettingsComponent implements OnInit {

  /**
   * List settings
   */
  listConversionSettings: any[] = [];

  /**
   * Open modal
   */
  open = false;

  /**
   * current user login
   */
  userLogin: any;

  /**
   * item selected
   */
  selectCurrent: any;
  itemDelete: any;

  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;

  constructor(
    private conversionSettingsService: ConversionSettingsService,
    private authService: AuthService,
    private translate: TranslateService,
    private modalService: ModalService,
    private router: Router) { }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    this.userLogin = await this.authService.getCurrentUser().toPromise();
    await this.research();
  }

  /**
   * Delete item
   */
  async handleDelete(item: any): Promise<void> {
    this.itemDelete = item;
    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModal.prompt(msg, null, true, 'delete');
    });
  }

  /**
   * Open register
   */
  openModal(status?: string): void {
    if (status === 'create') {
      this.selectCurrent = null;
    }
    this.open = true;
  }

  /**
   * Close modal
   */
  async closeModal(event: any): Promise<void> {
    if (event.status && event.status === 'upCreate') {
      await this.research();
    }
    this.open = event.open;
  }

  /**
   * Click row
   */
  selectedRow(select: any): void {
    this.selectCurrent = select;
    this.open = true;
  }

  /**
   * Search list
   */
  async research(): Promise<void> {
    this.listConversionSettings = await this.conversionSettingsService.getShopConversionList(this.userLogin.shop_id).toPromise();
  }

  /**
   * Emit confirm
   */
  handleConfirm(event): void {
    if (event.name === 'delete') {
      this.conversionSettingsService.deleteShopConversion(this.userLogin.shop_id, this.itemDelete.id).subscribe(res => {
        this.itemDelete = null;
        this.research();
        this.translate.get('conversionSettings.deletetionHasBeenCompleted').subscribe((msg: string) => {
          this.modalService.open(msg);
        });
      });
    }
  }

  /**
   * To
   */
  handleBackTo(): void {
    this.router.navigate(['/reservations']);
  }
}
