/*
  # Add test data for the marketplace

  1. Categories
    - Add initial service categories with icons and descriptions
  
  2. Users
    - Create test provider accounts
    - Create test client accounts
  
  3. Service Providers
    - Add provider profiles with ratings and availability
    - Set up initial pricing and services
*/

-- Add service categories
INSERT INTO service_categories (id, name, icon, description, active)
VALUES
  ('cat_tourist', 'Guia Turístico', '🏛️', 'Guias profissionais para sua viagem', true),
  ('cat_legal', 'Advogados', '⚖️', 'Consultoria jurídica especializada', true),
  ('cat_medical', 'Médicos', '👨‍⚕️', 'Atendimento médico domiciliar', true),
  ('cat_transport', 'Transporte', '🚗', 'Transporte particular de passageiros', true);

-- Create test provider users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES
  ('prov_1', 'maria@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('prov_2', 'joao@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('prov_3', 'ana@example.com', crypt('password123', gen_salt('bf')), now(), now(), now()),
  ('prov_4', 'pedro@example.com', crypt('password123', gen_salt('bf')), now(), now(), now());

-- Add user profiles for providers
INSERT INTO users (id, email, name, user_type, phone_number, created_at, updated_at)
VALUES
  ('prov_1', 'maria@example.com', 'Maria Silva', 'professional', '+5511999999991', now(), now()),
  ('prov_2', 'joao@example.com', 'João Santos', 'professional', '+5511999999992', now(), now()),
  ('prov_3', 'ana@example.com', 'Ana Oliveira', 'professional', '+5511999999993', now(), now()),
  ('prov_4', 'pedro@example.com', 'Pedro Costa', 'professional', '+5511999999994', now(), now());

-- Add service providers
INSERT INTO service_providers (id, user_id, category_id, status, rating, total_ratings, price, created_at, updated_at)
VALUES
  ('sp_1', 'prov_1', 'cat_tourist', 'approved', 4.8, 156, 150.00, now(), now()),
  ('sp_2', 'prov_2', 'cat_legal', 'approved', 4.9, 243, 300.00, now(), now()),
  ('sp_3', 'prov_3', 'cat_medical', 'approved', 4.7, 89, 250.00, now(), now()),
  ('sp_4', 'prov_4', 'cat_transport', 'approved', 4.6, 567, 80.00, now(), now());

-- Add provider availability (example for one week)
INSERT INTO provider_availability (provider_id, day_of_week, start_time, end_time, slot_duration, is_available)
SELECT
  provider_id,
  day_of_week,
  start_time,
  end_time,
  60, -- 1 hour slots
  true
FROM (
  SELECT 'sp_1' as provider_id, generate_series(0, 6) as day_of_week,
         '09:00' as start_time, '17:00' as end_time
  UNION ALL
  SELECT 'sp_2', generate_series(0, 6), '08:00', '18:00'
  UNION ALL
  SELECT 'sp_3', generate_series(0, 6), '10:00', '16:00'
  UNION ALL
  SELECT 'sp_4', generate_series(0, 6), '07:00', '20:00'
) as availability;

-- Add some sample ratings
INSERT INTO provider_ratings (provider_id, client_id, rating, comment, created_at)
SELECT
  provider_id,
  'test_client', -- Placeholder client ID
  rating,
  comment,
  created_at
FROM (
  VALUES
    ('sp_1', 5, 'Excelente guia! Muito conhecimento sobre a cidade.', now() - interval '2 days'),
    ('sp_1', 4, 'Ótimo serviço, recomendo!', now() - interval '5 days'),
    ('sp_2', 5, 'Advogado muito competente e profissional.', now() - interval '1 day'),
    ('sp_2', 5, 'Resolveu meu caso rapidamente.', now() - interval '3 days'),
    ('sp_3', 4, 'Médica atenciosa e pontual.', now() - interval '4 days'),
    ('sp_3', 5, 'Excelente atendimento domiciliar.', now() - interval '6 days'),
    ('sp_4', 5, 'Motorista pontual e educado.', now() - interval '1 day'),
    ('sp_4', 4, 'Carro limpo e confortável.', now() - interval '2 days')
) as ratings(provider_id, rating, comment, created_at);