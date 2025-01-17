import { supabase } from './supabase';
import { ServiceProvider, ServiceRequest } from '../types/service';

export async function findBestProvider(categoryId: string, scheduledDate?: Date): Promise<ServiceProvider | null> {
  try {
    let query = supabase
      .from('service_providers')
      .select(`
        *,
        ratings (
          rating,
          created_at
        )
      `)
      .eq('category_id', categoryId)
      .eq('status', 'approved');

    if (scheduledDate) {
      // Add availability check for scheduled requests
      query = query.contains('availability', {
        dayOfWeek: scheduledDate.getDay(),
        isAvailable: true
      });
    }

    const { data: providers, error } = await query
      .order('rating', { ascending: false })
      .order('total_ratings', { ascending: false });

    if (error) throw error;

    // Filter out providers who have rejected this request
    const availableProviders = providers.filter(provider => 
      !provider.current_requests || provider.current_requests < 5
    );

    return availableProviders[0] || null;
  } catch (error) {
    console.error('Error finding best provider:', error);
    throw error;
  }
}

export async function getProviderAvailability(providerId: string, date: Date): Promise<TimeSlot[]> {
  try {
    const { data: availability, error } = await supabase
      .from('provider_availability')
      .select('*')
      .eq('provider_id', providerId)
      .eq('day_of_week', date.getDay());

    if (error) throw error;

    // Get existing bookings for the date
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const { data: bookings } = await supabase
      .from('service_requests')
      .select('scheduled_time')
      .eq('provider_id', providerId)
      .gte('scheduled_date', startOfDay.toISOString())
      .lte('scheduled_date', endOfDay.toISOString());

    // Convert availability to time slots
    const slots: TimeSlot[] = [];
    availability.forEach(slot => {
      const start = new Date(`1970-01-01T${slot.start_time}Z`);
      const end = new Date(`1970-01-01T${slot.end_time}Z`);
      const duration = slot.slot_duration || 60; // default 1 hour slots

      while (start < end) {
        const slotStart = start.toTimeString().slice(0, 5);
        start.setMinutes(start.getMinutes() + duration);
        const slotEnd = start.toTimeString().slice(0, 5);

        // Check if slot is already booked
        const isBooked = bookings?.some(booking => 
          booking.scheduled_time === slotStart
        );

        slots.push({
          startTime: slotStart,
          endTime: slotEnd,
          available: !isBooked
        });
      }
    });

    return slots;
  } catch (error) {
    console.error('Error getting provider availability:', error);
    throw error;
  }
}

export async function updateProviderRating(providerId: string, rating: number): Promise<void> {
  try {
    const { data: provider, error: providerError } = await supabase
      .from('service_providers')
      .select('rating, total_ratings')
      .eq('id', providerId)
      .single();

    if (providerError) throw providerError;

    const newTotalRatings = provider.total_ratings + 1;
    const newRating = (provider.rating * provider.total_ratings + rating) / newTotalRatings;

    const { error: updateError } = await supabase
      .from('service_providers')
      .update({
        rating: newRating,
        total_ratings: newTotalRatings
      })
      .eq('id', providerId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error updating provider rating:', error);
    throw error;
  }
}