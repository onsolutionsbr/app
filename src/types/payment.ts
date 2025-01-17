export interface Payment {
  id: string;
  serviceRequestId: string;
  amount: number;
  platformFee: number;
  providerAmount: number;
  status: PaymentStatus;
  stripePaymentId: string;
  providerId: string;
  clientId: string;
  createdAt: Date;
  paidToProviderAt?: Date;
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PAID_TO_PROVIDER = 'paid_to_provider'
}

export interface PaymentSummary {
  totalRevenue: number;
  platformFees: number;
  pendingPayouts: number;
  completedPayouts: number;
  totalTransactions: number;
}