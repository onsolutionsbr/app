import { supabase } from './supabase';
import { ServiceRequest, RequestStatus } from '../types/service';

export async function createBooking(
  clientId: string,
  providerId: string,
  categoryId: string,
  isImmediate: boolean,
  scheduledDate?: Date,
  scheduledTime?: string
): Promise<ServiceRequest> {
  try {
    const { data: booking, error } = await supabase
      .from('service_requests')
      .insert({
        client_id: clientId,
        provider_id: providerId,
        category_id: categoryId,
        status: RequestStatus.PENDING,
        is_immediate: isImmediate,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        created_at: new Date().toISOString()
      })
      .select('*')
      .single();

    if (error) throw error;
    return booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
}

export async function getProviderBookings(providerId: string): Promise<ServiceRequest[]> {
  try {
    const { data: bookings, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        client:client_id (
          name,
          email,
          phone_number
        )
      `)
      .eq('provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return bookings;
  } catch (error) {
    console.error('Error getting provider bookings:', error);
    throw error;
  }
}

export async function getClientBookings(clientId: string): Promise<ServiceRequest[]> {
  try {
    const { data: bookings, error } = await supabase
      .from('service_requests')
      .select(`
        *,
        provider:provider_id (
          user:user_id (
            name,
            email,
            phone_number
          )
        )
      `)
      .eq('client_id', clientId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return bookings;
  } catch (error) {
    console.error('Error getting client bookings:', error);
    throw error;
  }
}

export async function updateBookingStatus(
  bookingId: string,
  status: RequestStatus
): Promise<void> {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', bookingId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}