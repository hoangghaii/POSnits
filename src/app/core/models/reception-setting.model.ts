export class ReceptionSetting {
  id?: number;
  shop_id: number;
  reserv_interval: string;
  recept_rest: string;
  recept_amount: string;
  cancel_setting_flg: string;
  cancel_limit: string;
  future_reserv_num: string;
  cancel_wait_flg?: string;
  menu_select_flg: string;
  staff_select_flg: string;
  guest_flg: string;
  member_reserve_flg: string;
  updated_at?: string;
}
