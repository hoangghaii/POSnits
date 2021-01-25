export class AccoutingCustody {
  id?: number;
  customer_id: number;
  shop_id: number;
  reservation_id: number;
  payment_id: number;
  money: number;
  updated_at: string;
  details: [
    {
      id?: number;
      sale_id?: number;
      category_cd: string;
      menu_id: number;
      money: number;
      tax_id: number;
      discount_id: number;
      discount: number;
      amount: number;
      updated_at: string;
    }
  ];
}
