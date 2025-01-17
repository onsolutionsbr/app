import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';
import { Payment, PaymentStatus } from '../types/payment';

let stripePromise: Promise<any>;

export const getStripe = () => {
  if (!stripePromise) {
    const stripePublicKey = localStorage.getItem('stripePublicKey');
    if (!stripePublicKey) {
      throw new Error('Stripe public key not found');
    }
    stripePromise = loadStripe(stripePublicKey);
  }
  return stripePromise;
};

export const createPaymentIntent = async (amount: number) => {
  try {
    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { amount }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const processPayment = async (paymentIntentId: string, serviceRequestId: string) => {
  try {
    const { data: payment, error } = await supabase
      .from('payments')
      .insert([
        {
          stripe_payment_id: paymentIntentId,
          service_request_id: serviceRequestId,
          status: PaymentStatus.COMPLETED
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return payment;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw error;
  }
};

export const getPaymentSummary = async () => {
  try {
    const { data, error } = await supabase
      .rpc('get_payment_summary');

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting payment summary:', error);
    throw error;
  }
};

export const getPendingPayouts = async () => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        service_requests (
          provider: provider_id (
            user: user_id (
              email,
              name
            )
          )
        )
      `)
      .eq('status', PaymentStatus.COMPLETED)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting pending payouts:', error);
    throw error;
  }
};

export const markPayoutCompleted = async (paymentId: string) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        status: PaymentStatus.PAID_TO_PROVIDER,
        paid_to_provider_at: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error marking payout as completed:', error);
    throw error;
  }
};