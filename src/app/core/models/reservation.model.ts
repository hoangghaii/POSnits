export class Reservation {
    id?: number;
    customerId: number;
    customerName: string;
    customerSex: string;
    shopId: number;
    reservationTime: string;
    treatmentId: number;
    treatmentName: string;
    equipmentId: number;
    equipmentCd: string;
    equipmentName: string;
    staffId: number;
    staffName: string;
    staffImg: string;
    treatmentTime: number;
    webReservationFlg: string;
    prepaidFlg: string;
    visitFlg: string;
    paymentFlg: string;
    updatedAt: string;
    details: [
        {
          id: number;
          reservation_id: number;
          treatment_time: string;
          category_cd: string;
          menu_id: number;
          updated_at: string;
        }
    ];
}
