import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';
import { ModalService } from 'src/app/core/services';
import { ContractService } from 'src/app/core/services/apis';
import { LocalTime } from 'src/app/core/utils/local-time';

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.scss']
})
export class ContractInfoComponent implements OnChanges {
  @Input() userLogin;
  @Input() paramMapId;
  contractList: any[] = [];
  open = false;
  submitted = false;
  limitDate: Date;
  selectedItem;
  statusName;
  @ViewChild('confirmModal') confirmModal: ConfirmModalComponent;
  constructor(
    private contractService: ContractService,
    private router: Router,
    private modalService: ModalService,
    private translate: TranslateService) { }

  /**
   * Init
   */
  async ngOnChanges(): Promise<void> {
    this.translate.get('customer.statusName').subscribe((trans) => {
      this.statusName = trans;
    });
    if (this.paramMapId !== undefined && this.paramMapId !== null) {
      this.contractList = await this.getContractList();
    }
  }

  /**
   * リスト予約を取得する
   */
  async getContractList(): Promise<any[]> {
    return this.contractService.getContractList(this.paramMapId).toPromise();
  }

  /**
   * Event click update contract
   * @param name
   * @param data
   */
  update(name, data) {
    this.selectedItem = data;
    switch (name) {
      case "deadlineChange":
        this.limitDate = this.selectedItem.limit_date;
        this.open = true;
        break;
      case "cancellation":
        this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
          this.confirmModal.prompt(msg, null, true, 'delete');
        });
        break;
      case "contractChange":
        // TODO
        // this.router.navigate(['...']);
        break;
    }
  }

  /**
   * Emit confirm
   */
  handleConfirm(event) {
    // Delete
    if (event.name === 'delete') {
      this.contractService.deleteContract(this.paramMapId, this.selectedItem.id).subscribe(async () => {
        this.contractList = await this.getContractList();
        this.translate.get('msgCompleted.deletetionHasBeenCompleted').subscribe((msg: string) => {
          this.modalService.open(msg);
        });
      })
    }
  }

  /**
   * Update limit date
   */
  updateLimitDate() {
    this.selectedItem.limit_date = this.limitDate;
    this.open = false;
    const arr = [{ ...this.selectedItem }]
    this.contractService.updateContract(this.paramMapId, arr).subscribe(async () => {
      this.contractList = await this.getContractList();
      this.translate.get('msgCompleted.updateHasBeenCompleted').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
    });
  }

  /**
   * Get sum number count
   */
  getSumNumberCount(data) {
    let count = 0;
    for (let item of data) {
      count += item.number_count;
    }
    return count;
  }

  /**
   * Get max number count
   */
  getMaxNumberCount(data) {
    let maxCount = 0;
    for (let item of data) {
      if (maxCount < item.number_count) {
        maxCount = item.number_count;
      }
    }
    return maxCount;
  }

  /**
   * Format date
   * @param date
   */
  formatDate(date) {
    return LocalTime.formatDate(date);
  }

  /**
   * Change router
   */
  changeRouter() {
    this.router.navigate(['shops/customer-info']);
  }

  /**
   * 契約情報のステータス
   */
  getStatus(data) {
    let status = '';
    const maxNumberCount = this.getMaxNumberCount(data.details)
    if (new Date(data.limit_date) > new Date() && data.count > maxNumberCount) {
      status = this.statusName.underContract;
    } else if (data.deleted_at !== null) {
      status = this.statusName.cancellation;
    } else if (new Date(data.limit_date) < new Date() && data.count > maxNumberCount) {
      status = this.statusName.expired;
    } else if (data.count == maxNumberCount) {
      status = this.statusName.contractCompleted;
    }
    return status;
  }
}
