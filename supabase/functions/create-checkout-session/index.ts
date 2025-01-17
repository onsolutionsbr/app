import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { stripe } from '../_shared/stripe.ts';
import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { providerId, categoryId, bookingDetails } = await req.json();

    // Get provider details from database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: provider } = await supabase
      .from('service_providers')
      .select('*, user:user_id(*)')
      .eq('id', providerId)
      .single();

    if (!provider) {
      throw new Error('Provider not found');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: `Serviço com ${provider.user.name}`,
              description: bookingDetails.isImmediate 
                ? 'Atendimento Imediato'
                : `Agendado para ${bookingDetails.scheduledDate} às ${bookingDetails.scheduledTime}`,
            },
            unit_amount: provider.price * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/client/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/services/book/${categoryId}/${providerId}?type=${bookingDetails.isImmediate ? 'immediate' : 'scheduled'}`,
      metadata: {
        providerId,
        categoryId,
        isImmediate: bookingDetails.isImmediate.toString(),
        scheduledDate: bookingDetails.scheduledDate,
        scheduledTime: bookingDetails.scheduledTime,
      },
    });

    return new Response(
      JSON.stringify({ sessionId: session.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});