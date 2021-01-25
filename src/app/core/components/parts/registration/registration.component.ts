import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from 'src/app/constants/constants';
import { Helper } from 'src/app/core/utils/helper';
import { ModalService, ValidatorService } from 'src/app/core/services';
import { EquipmentMenuService, MenuReserveService, ReservationService, StaffMenuService } from 'src/app/core/services/apis';
import * as moment from 'moment';
import { ConfirmModalComponent } from 'src/app/core/directives/confirm-modal.component';

@Component({
  selector: 'app-registration',
  templateUrl: 'registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit, OnChanges {
  /**
   * Form
   */
  formRegistration: FormGroup;
  detail: FormGroup;
  submitted = false;

  timeList: any[] = Helper.generateTime(24);
  listEqupmentCd = Constants.listEqupmentCd;
  selectMenuStatus = false;
  arrSelect = [];
  techClassList = [];
  listEquipment = [];
  openSearch = false;
  numberOfPeople = [];

  /**
   * Form map item
   */
  formMap;

  @Input() isOpen = false;
  @Input() selectCurrent: any;
  @Input() userList?: any;
  @Input() userLogin: any;
  @Output() confirm: EventEmitter<object> = new EventEmitter<object>(null);
  @ViewChild('confirmModal') confirmModalSecond: ConfirmModalComponent;

  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private reservationService: ReservationService,
    private modalService: ModalService,
    private staffMenuService: StaffMenuService,
    private equipmentMenuService: EquipmentMenuService,
    private menuService: MenuReserveService) { }

  /**
   * コンポーネント初期処理
   */
  async ngOnInit(): Promise<void> {
    for (let i = 1; i <= 10; i++) {
      this.numberOfPeople.push({ value: i });
    }
    this.translate.get('reservationRegistration').subscribe((trans) => {
      this.formMap = {
        customerLastName: trans?.customerLastName,
        customerFirtName: trans?.customerFirtName,
        reservationDate: trans?.reservationDate,
        reservationHour: trans?.reservationHour,
        customerId: trans?.customerId,
        details:  {
          staff_id: trans?.personInCharge,
          equipment1: trans?.treatmentTable,
          equipment2: trans?.equipment,
        }
      };
    });

    this.initForm();
  }

  /**
   * ポップアップを変更する
   */
  ngOnChanges(): void {
    if (this.isOpen && this.selectCurrent) {
      this.reservationService.getReservation(String(this.selectCurrent.shopId), String(this.selectCurrent.id)).subscribe((res: any) => {
        const reservationDateRes = moment(res[0].reservation_time).format('YYYY-MM-DD');
        const reservationHourRes = moment(res[0].reservation_time).format('HH:mm');

        const fullName = res[0].customer_name.split(' ');
        const lastNameRes = fullName[0];
        const firstNameRes = fullName[1];

        this.addItemIntoArrSelect(res[0].details);
        this.getListReserveMenu();
        this.formRegistration.patchValue({
          id: res[0].id,
          customerId: res[0].customer_id,
          customerLastName: lastNameRes,
          customerFirtName: firstNameRes,
          shopId: res[0].shop_id,
          reservationTime: res[0].reservation_time,
          reservationDate: reservationDateRes,
          reservationHour: reservationHourRes,
          staffId: res[0].staff_id,
          treatmentsTime: res[0].treatments_time,
          webReservationFlg: res[0].web_reservation_flg,
          prepaidFlg: res[0].prepaid_flg,
          visitFlg: res[0].visit_flg,
          paymentFlg: res[0].payment_flg,
          cancelFlg: res[0].cancel_flg,
          remark: res[0].remark,
          memo: res[0].memo,
          details: res[0].details,
          updatedAt: res[0].updated_at,
        });
      });
    }

    if (this.isOpen && this.selectCurrent === null) {
      this.submitted = false;
      this.initForm();
    }
  }

  /**
   * Init form
   */
  initForm(): void {
    this.formRegistration = this.fb.group({
      id: [null],
      customerId: ['', [ValidatorService.required]],
      shopId: [''],
      reservationTime: [''],
      staffId: ['1'],
      treatmentsTime: [''],
      webReservationFlg: [''],
      prepaidFlg: [''],
      visitFlg: [''],
      paymentFlg: [''],
      cancelFlg: [''],
      remark: [''],
      memo: [''],
      details: this.fb.array([]),
      updatedAt: [null],

      customerLastName: ['', [ValidatorService.required]],
      customerFirtName: ['', [ValidatorService.required]],
      reservationDate: ['', [ValidatorService.required]],
      reservationHour: ['', [ValidatorService.required]],
      numberOfPeople: [1]
    });
  }

  /**
   * モーダルを閉じる
   */
  closeModal(): void {
    this.submitted = false;
    this.selectMenuStatus = false;
    this.confirm.emit({ isOpen: false, currentSelect: null });
    this.arrSelect = [];
    this.formRegistration.reset();
    this.selectCurrent = null;
  }

  /**
   * On submit
   */
  onSubmit(): void {
    this.submitted = true;
    const dtControls = this.formRegistration.get('details') as FormArray;
    dtControls.controls.forEach(x => {
      x.get('staff_id').setValidators([ValidatorService.required]);
      x.get('staff_id').updateValueAndValidity();
    });

    if (!this.formRegistration.valid) {
      return;
    }

    if (this.selectCurrent) {
      this.translate.get('confirm.updateMessage').subscribe((msg: string) => {
        this.confirmModalSecond.prompt(msg, null, true, 'update');
      });
      return;
    }
    this.onCreate();
  }

  /**
   * On create
   */
  onCreate(): void {
    const reservation: any = this.parseObj(this.formRegistration.getRawValue());

    if (reservation[0].details && reservation[0].details.length <= 0) {
      this.translate.get('reservationRegistration.msgSelectMenu').subscribe((msg: string) => {
        this.modalService.open(msg);
      });
      return;
    }
    this.reservationService.createReservation(String(this.userLogin.shop_id), reservation).subscribe(() => {
      this.confirm.emit({ open: false, status: 'upCreate' });
      this.translate
        .get('addStaff.staffCreate.registrationHasBeenCompleted')
        .subscribe((msg: string) => {
          this.modalService.open(msg);
          this.initForm();
          this.submitted = false;
        });
    });
  }

  /**
   * On delete
   */
  onDelete(): void {
    this.translate.get('confirm.deleteMessage').subscribe((msg: string) => {
      this.confirmModalSecond.prompt(msg, null, true, 'delete');
    });
  }

  /**
   * 確認を送信
   */
  handleConfirm(event): void {
    const reservation: any = this.parseObj(this.formRegistration.getRawValue());
    // 更新
    if (event.name === 'update') {
      reservation[0].details.map(x => {
        x.reservation_id = reservation[0].id;
      });
      this.reservationService.updateReservationReceptTime(String(this.userLogin.shop_id), reservation).subscribe(() => {
        this.submitted = false;
        this.confirm.emit({ open: false, status: 'upCreate' });
        this.translate
          .get('addStaff.staffCreate.updateHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
            this.initForm();
            this.submitted = false;
          });
      });
    }

    // 削除
    if (event.name === 'delete') {
      this.reservationService.deleteReservationReceptTime(String(this.userLogin.shop_id), String(reservation[0].id)).subscribe(() => {
        this.confirm.emit({ open: false, status: 'upCreate' });
        this.translate
          .get('addStaff.staffCreate.deletetionHasBeenCompleted')
          .subscribe((msg: string) => {
            this.modalService.open(msg);
            this.submitted = false;
          });
      });
    }
  }

  /**
   * On select menu
   */
  onSelectMenu(): void {
    this.selectMenuStatus = true;
  }

  /**
   * モーダルを閉じる
   */
  async confirmModalFirst(event: any): Promise<void> {
    this.selectMenuStatus = event.open;
    if (event.arrSelect) {
      this.addItemIntoArrSelect(event.arrSelect);
    }
  }

  /**
   * Add Item Into ArrSelect
   */
  async addItemIntoArrSelect(arrSelect): Promise<void> {
    const menuIds = [];
    this.arrSelect = arrSelect;
    await arrSelect.forEach((i) => {
      menuIds.push(i.menu_id);
    });
    await this.getStaffMenuByMenuId(menuIds);
    await this.getEquipmentMenuByMenuId(menuIds);
    while (this.details.length !== 0) {
      this.details.removeAt(0);
    }
    await arrSelect.map(i => {
      this.details.push(this.newDetailChange(i));
    });
  }

  /**
   * Get answer item
   */
  get details(): FormArray {
    return this.formRegistration.get('details') as FormArray;
  }

  /**
   * New answer item
   */
  newDetail(): any {
    this.detail = this.fb.group({
      id: [null],
      reservation_id: [null],
      treatment_time: [''],
      category_cd: [''],
      menu_id: [''],
      equipment1: [''],
      equipment2: [''],
      staff_id: ['', [ValidatorService.required]],
      updatedAt: [null],
    });

    return this.detail;
  }

  newDetailChange(value?): any {
    return this.fb.group({
      id: [value.id ? value.id : null],
      reservation_id: [value.reservation_id ? value.reservation_id : null],
      treatment_time: [value.treatment_time ? value.treatment_time : ''],
      category_cd: [value.category_cd ? value.category_cd : ''],
      menu_id: [value.menu_id ? value.menu_id : ''],
      equipment1: [value.equipment1 ? value.equipment1 : ''],
      equipment2: [value.equipment2 ? value.equipment2 : ''],
      staff_id: [value.staff_id ? value.staff_id : ''],
      updatedAt: [value.updatedAt ? value.reservation_updatedAtid : null],
    });
  }

  /**
   * Search customer
   */
  customerSearch(): void {
    this.openSearch = true;
  }

  searchResult(event: any): void {
    this.openSearch = event.status;
    this.formRegistration.controls.customerLastName.setValue(event.customerList?.lastname);
    this.formRegistration.controls.customerFirtName.setValue(event.customerList?.firstname);
    this.formRegistration.controls.customerId.setValue(event.customerList?.id);
  }

  /**
   * Parse obj
   */
  parseObj(obj: any): any {
    const reservationTime =
      this.formRegistration.controls.reservationDate.value + ' ' + this.formRegistration.controls.reservationHour.value;
    const detailsEl = [];
    let totalTreatmentTime = 0;
    obj.details.forEach((element, index) => {
      detailsEl.push(this.parseObjDetail(element, index));
      totalTreatmentTime += Number(this.arrSelect[index]?.treatment_time);
    });
    return [{
      id: obj.id,
      customer_id: obj.customerId,
      shop_id: this.userLogin.shop_id,
      reservation_time: moment(reservationTime).format('YYYY-MM-DD HH:mm:ss'),

      // Valus staff_id will be auto first item of deatail.
      staff_id: detailsEl[0] ? Number(detailsEl[0].staff_id) : Number(obj.staffId),

      treatments_time: (totalTreatmentTime ? totalTreatmentTime : Number(obj.treatmentsTime)),
      web_reservation_flg: '0',
      prepaid_flg: '0',
      visit_flg: '0',
      payment_flg: '0',
      cancel_flg: '0',
      remark: obj.remark ? obj.remark : '',
      memo: obj.memo ? obj.memo : '',
      details: detailsEl,
      updated_at: obj.updatedAt,
    }];
  }

  /**
   * Parse obj for detail
   */
  parseObjDetail(obj: any, index: number): any {
    return {
      id: obj.id,
      reservation_id: obj.reservation_id,
      treatment_time: Number(this.arrSelect[index]?.treatment_time),
      category_cd: this.arrSelect[index]?.category_cd,
      menu_id: this.arrSelect[index]?.menu_id,
      equipment1: Number(obj.equipment1),
      equipment2: Number(obj.equipment2),
      staff_id: Number(obj.staff_id),
      updated_at: obj.updatedAt,
    };
  }

  /**
   * Get staff item by menu id
   */
  getStaffMenuByMenuId(staffMenuIds): any {
    this.staffMenuService.getStaffMenuListByMenuIdArray(JSON.stringify(staffMenuIds)).subscribe((res: any) => {
      if (res && res.length) {
        this.arrSelect.forEach((element, index) => {
          this.arrSelect[index].menuStaffs = [];
          res.forEach(item => {
            if (element.menu_id === item.menu_id) {
              this.arrSelect[index].menuStaffs.push(item);
            }
          });
        });
      }
    });
  }

  /**
   * Get equipment item by menu id
   */
  getEquipmentMenuByMenuId(equipmentMenuIds): any {
    this.equipmentMenuService.getEquipmentMenuListByMenuIdArray(JSON.stringify(equipmentMenuIds)).subscribe((res: any) => {
      if (res && res.length) {
        this.arrSelect.forEach((element, index) => {
          this.arrSelect[index].menuEquipments = [];
          res.forEach(item => {
            if (element.menu_id === item.menu_id) {
              this.arrSelect[index].menuEquipments.push(item);
            }
          });
        });
      }
    });
  }

  /**
   * Get List Reserve Menu
   */
  getListReserveMenu(): any {
    this.menuService.getListReserveMenu(this.userLogin.shop_id).subscribe((res: any) => {
      if (res && res.length) {
        res.forEach(element => {
          element.details.forEach(item => {
            this.arrSelect.forEach(i => {
              if (i.menu_id === item.id) {
                i.menu_name = item.name;
              }
            });
          });
        });
      }
    });
  }

  /**
   * Change name
   */
  onChangeName(): void {
    this.formRegistration.controls.customerId.setValue('');
  }

  /**
   * Add people
   */
  addPeople() {
    const number = this.numberOfPeople.length;
    const value = Number(this.formRegistration.controls.numberOfPeople.value);
    if (value == number) {
      this.numberOfPeople.push({ value: number + 1 });
    }
    this.formRegistration.controls.numberOfPeople.setValue(value + 1);
  }
}
