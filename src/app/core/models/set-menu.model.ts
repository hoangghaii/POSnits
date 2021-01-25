export class SetMenu {
  id?: number;
  class_id: number;
  shop_id: number;
  category_cd: string;
  name: string;
  sort: number;
  web_flg: number;
  color_code: string;
  updated_at: string;
  details: [
    {
      id?: number;
      setmenu_id: number;
      category_cd: string;
      menu_id: string;
      discount: number;
      updated_at: string;
    }
  ];
}
