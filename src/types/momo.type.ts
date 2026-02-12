export interface RefundPaymentData {
  orderId: string;
  transId: string;
  amount: number;
  startTime: string;
  paymentMethod: string;
  paymentStatus: string;
}