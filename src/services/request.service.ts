import { supabase } from './supabase';
import { ServiceRequest, RequestStatus } from '../types/service';
import { findBestProvider } from './provider.service';

export async function createServiceRequest(
  clientId: string,
  serviceId: string,
  scheduledDate: Date | null,
  scheduledTime?: string
): Promise<ServiceRequest> {
  try {
    // Find the best available provider
    const provider = await findBestProvider(serviceId, scheduledDate);
    
    if (!provider) {
      throw new Error('No providers available for this service');
    }

    const { data: request, error } = await supabase
      .from('service_requests')
      .insert({
        client_id: clientId,
        service_id: serviceId,
        provider_id: provider.id,
        status: RequestStatus.PENDING,
        scheduled_date: scheduledDate,
        scheduled_time: scheduledTime,
        rejected_by: []
      })
      .select()
      .single();

    if (error) throw error;
    return request;
  } catch (error) {
    console.error('Error creating service request:', error);
    throw error;
  }
}

export async function handleRequestRejection(requestId: string, providerId: string): Promise<void> {
  try {
    // Get current request details
    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (requestError) throw requestError;

    // Add current provider to rejected list
    const rejectedBy = [...(request.rejected_by || []), providerId];

    // Find next best provider
    const nextProvider = await findBestProvider(
      request.service_id,
      request.scheduled_date
    );

    if (!nextProvider) {
      // No more providers available
      await supabase
        .from('service_requests')
        .update({
          status: RequestStatus.CANCELLED,
          rejected_by: rejectedBy
        })
        .eq('id', requestId);

      throw new Error('No available providers for this service');
    }

    // Update request with new provider
    const { error: updateError } = await supabase
      .from('service_requests')
      .update({
        provider_id: nextProvider.id,
        rejected_by: rejectedBy
      })
      .eq('id', requestId);

    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error handling request rejection:', error);
    throw error;
  }
}

export async function rateServiceRequest(
  requestId: string,
  rating: number,
  feedback?: string
): Promise<void> {
  try {
    const { data: request, error: requestError } = await supabase
      .from('service_requests')
      .update({
        rating,
        feedback,
        status: RequestStatus.COMPLETED
      })
      .eq('id', requestId)
      .select('provider_id')
      .single();

    if (requestError) throw requestError;

    // Update provider's overall rating
    await updateProviderRating(request.provider_id, rating);
  } catch (error) {
    console.error('Error rating service request:', error);
    throw error;
  }
}