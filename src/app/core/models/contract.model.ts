export class Contract {
  id: number;
  course_id: number;
  name: string;
  price: string;
  discount: number;
  limit_date: string;
  updated_at: string;
  details: {
    id: number;
    contract_id: number;
    sale_id: number;
    number_count: number;
    updated_at: string;
  }
}
