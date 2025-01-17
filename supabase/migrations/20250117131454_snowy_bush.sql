/*
  # Payment System Schema

  1. New Tables
    - payments
      - Stores all payment transactions
      - Includes platform fee calculations
      - Tracks payment status and provider payouts
    
  2. Security
    - Enable RLS
    - Add policies for admin access
    
  3. Functions
    - get_payment_summary: Calculates payment statistics
*/

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_request_id uuid REFERENCES service_requests(id) NOT NULL,
  amount numeric(10,2) NOT NULL,
  platform_fee numeric(10,2) NOT NULL,
  provider_amount numeric(10,2) NOT NULL,
  status text NOT NULL,
  stripe_payment_id text NOT NULL,
  provider_id uuid REFERENCES service_providers(id) NOT NULL,
  client_id uuid REFERENCES users(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  paid_to_provider_at timestamptz,
  
  CONSTRAINT valid_amount CHECK (amount > 0),
  CONSTRAINT valid_platform_fee CHECK (platform_fee >= 0),
  CONSTRAINT valid_provider_amount CHECK (provider_amount >= 0),
  CONSTRAINT valid_payment_split CHECK (amount = platform_fee + provider_amount)
);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Admin can read all payments
CREATE POLICY "Admins can read all payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (auth.uid() IN (
    SELECT id FROM users WHERE user_type = 'admin'
  ));

-- Create function to get payment summary
CREATE OR REPLACE FUNCTION get_payment_summary()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  summary json;
BEGIN
  SELECT json_build_object(
    'totalRevenue', COALESCE(SUM(amount), 0),
    'platformFees', COALESCE(SUM(platform_fee), 0),
    'pendingPayouts', COALESCE(SUM(CASE WHEN status = 'completed' THEN provider_amount ELSE 0 END), 0),
    'completedPayouts', COALESCE(SUM(CASE WHEN status = 'paid_to_provider' THEN provider_amount ELSE 0 END), 0),
    'totalTransactions', COUNT(*)
  )
  INTO summary
  FROM payments;
  
  RETURN summary;
END;
$$;