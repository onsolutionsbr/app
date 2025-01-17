import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Auth helpers
export async function signUpUser(email: string, password: string, userData: {
  name: string;
  phone?: string;
  document?: string;
  user_type: 'client' | 'professional';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
  };
}) {
  try {
    // 1. Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('No user returned from sign up');

    // 2. Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email,
        name: userData.name,
        phone: userData.phone,
        document: userData.document,
        user_type: userData.user_type
      });

    if (profileError) throw profileError;

    // 3. Create address if provided
    if (userData.address) {
      const { error: addressError } = await supabase
        .from('addresses')
        .insert({
          user_id: authData.user.id,
          ...userData.address
        });

      if (addressError) throw addressError;
    }

    return authData;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signInUser(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

// Service helpers
export async function createService(serviceData: {
  category_id: string;
  client_id: string;
  provider_id?: string;
  type: 'remote' | 'inPerson';
  price: number;
  scheduled_date?: Date;
  scheduled_time?: string;
  description?: string;
  location_type?: string;
  location_details?: any;
}) {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert({
        ...serviceData,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
}

export async function updateServiceStatus(
  serviceId: string,
  status: 'accepted' | 'in_progress' | 'completed' | 'cancelled'
) {
  try {
    const { error } = await supabase
      .from('services')
      .update({ status })
      .eq('id', serviceId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating service status:', error);
    throw error;
  }
}

export async function createRating(ratingData: {
  service_id: string;
  rated_by: string;
  rated_user: string;
  rating: number;
  comment?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('ratings')
      .insert(ratingData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating rating:', error);
    throw error;
  }
}

// Category helpers
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(`
        *,
        required_fields (*),
        category_location_types (
          location_types (*)
        )
      `)
      .eq('active', true);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function createCategory(categoryData: {
  name: string;
  icon: string;
  description: string;
  service_type: 'remote' | 'inPerson' | 'both';
  required_fields?: Array<{
    name: string;
    field_type: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox';
    required?: boolean;
    validation_pattern?: string;
    validation_message?: string;
    options?: string[];
  }>;
  location_types?: string[];
}) {
  try {
    // 1. Create category
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .insert({
        name: categoryData.name,
        icon: categoryData.icon,
        description: categoryData.description,
        service_type: categoryData.service_type
      })
      .select()
      .single();

    if (categoryError) throw categoryError;

    // 2. Create required fields if provided
    if (categoryData.required_fields?.length) {
      const { error: fieldsError } = await supabase
        .from('required_fields')
        .insert(
          categoryData.required_fields.map(field => ({
            ...field,
            category_id: category.id
          }))
        );

      if (fieldsError) throw fieldsError;
    }

    // 3. Create location type associations if provided
    if (categoryData.location_types?.length) {
      const { error: locationTypesError } = await supabase
        .from('category_location_types')
        .insert(
          categoryData.location_types.map(locationTypeId => ({
            category_id: category.id,
            location_type_id: locationTypeId
          }))
        );

      if (locationTypesError) throw locationTypesError;
    }

    return category;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
}