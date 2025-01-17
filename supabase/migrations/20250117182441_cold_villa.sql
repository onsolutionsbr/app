/*
  # Initial Schema Setup

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text, unique)
      - name (text)
      - phone (text)
      - document (text)
      - user_type (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - addresses
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - street (text)
      - number (text)
      - complement (text)
      - neighborhood (text)
      - city (text)
      - state (text)
      - zip_code (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - categories
      - id (uuid, primary key)
      - name (text)
      - icon (text)
      - description (text)
      - service_type (text)
      - active (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - required_fields
      - id (uuid, primary key)
      - category_id (uuid, foreign key)
      - name (text)
      - field_type (text)
      - required (boolean)
      - validation_pattern (text)
      - validation_message (text)
      - options (text[])
      - created_at (timestamptz)

    - location_types
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - active (boolean)
      - created_at (timestamptz)
      - updated_at (timestamptz)

    - category_location_types
      - category_id (uuid, foreign key)
      - location_type_id (uuid, foreign key)
      - created_at (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text,
  document text,
  user_type text NOT NULL CHECK (user_type IN ('admin', 'professional', 'client')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create addresses table
CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  street text NOT NULL,
  number text NOT NULL,
  complement text,
  neighborhood text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip_code text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  icon text NOT NULL,
  description text NOT NULL,
  service_type text NOT NULL CHECK (service_type IN ('remote', 'inPerson', 'both')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create required_fields table
CREATE TABLE required_fields (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  field_type text NOT NULL CHECK (field_type IN ('text', 'number', 'date', 'select', 'file', 'checkbox')),
  required boolean DEFAULT true,
  validation_pattern text,
  validation_message text,
  options text[],
  created_at timestamptz DEFAULT now()
);

-- Create location_types table
CREATE TABLE location_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create category_location_types table
CREATE TABLE category_location_types (
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  location_type_id uuid REFERENCES location_types(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (category_id, location_type_id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE required_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_location_types ENABLE ROW LEVEL SECURITY;

-- Create policies

-- Users policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Addresses policies
CREATE POLICY "Users can read own addresses"
  ON addresses
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own addresses"
  ON addresses
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own addresses"
  ON addresses
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own addresses"
  ON addresses
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Categories policies
CREATE POLICY "Anyone can read active categories"
  ON categories
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Required fields policies
CREATE POLICY "Anyone can read required fields"
  ON required_fields
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage required fields"
  ON required_fields
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Location types policies
CREATE POLICY "Anyone can read active location types"
  ON location_types
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Admins can manage location types"
  ON location_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Category location types policies
CREATE POLICY "Anyone can read category location types"
  ON category_location_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage category location types"
  ON category_location_types
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND user_type = 'admin'
    )
  );

-- Create functions
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON addresses
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON location_types
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();