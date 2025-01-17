import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

let stripePromise: Promise<any>;

export const getStripe = () => {
  if (!stripePromise) {
    // Get the public key from admin settings
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    const publicKey = settings.stripePublicKey;
    if (!publicKey) {
      throw new Error('Stripe public key not found');
    }
    stripePromise = loadStripe(publicKey);
  }
  return stripePromise;
};

export const createCheckoutSession = async (
  providerId: string,
  categoryId: string,
  bookingDetails: {
    isImmediate: boolean;
    scheduledDate?: string;
    scheduledTime?: string;
  }
) => {
  try {
    // Create checkout session using Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        providerId,
        categoryId,
        bookingDetails
      }
    });

    if (error) throw error;

    const stripe = await getStripe();
    const result = await stripe.redirectToCheckout({
      sessionId: data.sessionId
    });

    if (result.error) {
      throw result.error;
    }

    return result;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};