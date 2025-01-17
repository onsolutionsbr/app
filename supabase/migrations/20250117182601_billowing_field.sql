/*
  # Service and Rating Schema

  1. New Tables
    - services
      - id (uuid, primary key)
      - category_id (uuid, foreign key)
      - client_id (uuid, foreign key)
      - provider_id (uuid, foreign key)
      - status (text)
      - type (text)
      - price (numeric)
      - scheduled_date (timestamptz)
      - scheduled_time (text)
      - description (text)
      - location_type (text)
      - location_details (jsonb)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - ratings
      - id (uuid, primary key)
      - service_id (uuid, foreign key)
      - rated_by (uuid, foreign key)
      - rated_user (uuid, foreign key)
      - rating (integer)
      - comment (text)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create services table
CREATE TABLE services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id),
  client_id uuid REFERENCES users(id),
  provider_id uuid REFERENCES users(id),
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
  type text NOT NULL CHECK (type IN ('remote', 'inPerson')),
  price numeric(10,2) NOT NULL,
  scheduled_date timestamptz,
  scheduled_time text,
  description text,
  location_type text,
  location_details jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ratings table
CREATE TABLE ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES services(id),
  rated_by uuid REFERENCES users(id),
  rated_user uuid REFERENCES users(id),
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Services policies
CREATE POLICY "Users can read services they're involved in"
  ON services
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = client_id OR 
    auth.uid() = provider_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

CREATE POLICY "Clients can create services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'client'
    )
  );

CREATE POLICY "Users can update services they're involved in"
  ON services
  FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = client_id OR 
    auth.uid() = provider_id OR
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Ratings policies
CREATE POLICY "Anyone can read ratings"
  ON ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create ratings for services they're involved in"
  ON ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM services
      WHERE id = service_id
      AND (client_id = auth.uid() OR provider_id = auth.uid())
    )
  );

-- Create trigger for services updated_at
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();