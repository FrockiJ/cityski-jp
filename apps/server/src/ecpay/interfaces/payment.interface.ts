/**
 * 支付初始化請求
 */
export interface CreditCardPaymentInitializeRequest {
  orderId: string;
  amount: number;
  callbackUrl?: string; // 支付完成後的回調 URL
}

/**
 * 支付初始化回應
 */
export interface CreditCardPaymentInitializeResponse {
  success: boolean;
  formHtml?: string;
  merchantTradeNo?: string;
  error?: string;
}

/**
 * ECPay 回調通知參數
 */
export interface EcpayCallbackNotification {
  MerchantID: string;
  RtnCode: number;
  RtnMsg: string;
  TradeNo: string;
  TradeAmt: number;
  PaymentDate: string;
  PaymentType: string;
  PaymentTypeChargeFee: number;
  TradeStatus: number;
  SimulatePaid?: number; // 測試模式標記
  CheckMacValue: string;
  [key: string]: any;
}

/**
 * 支付結果
 */
export interface PaymentResult {
  orderId: string;
  transactionId: string;
  ecpayTradeNo: string;
  amount: number;
  paymentMethod: 'Credit';
  paymentDate: string;
  status: 'success' | 'failure';
  merchantTradeNo: string;
}

/**
 * 支付 Callback 函數類型
 */
export type PaymentCallback = (
  paymentResult: PaymentResult,
) => Promise<void>;
