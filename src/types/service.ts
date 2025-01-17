export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  requiredDocuments: RequiredDocument[];
  active: boolean;
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  required: boolean;
}

export interface ServiceRequest {
  id: string;
  clientId: string;
  serviceId: string;
  providerId: string | null;
  status: RequestStatus;
  price: number;
  rating?: number;
  feedback?: string;
  scheduledDate: Date | null; // null for immediate requests
  scheduledTime?: string; // HH:mm format
  createdAt: Date;
  updatedAt: Date;
  rejectedBy?: string[];
}

export enum RequestStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ServiceProvider {
  id: string;
  userId: string;
  categoryId: string;
  documents: ProviderDocument[];
  status: ProviderStatus;
  rating: number;
  totalRatings: number;
  availability: Availability[];
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProviderDocument {
  id: string;
  type: string;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: Date;
}

export enum DocumentStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ProviderStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SUSPENDED = 'suspended'
}

export interface Availability {
  id: string;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  slotDuration: number; // in minutes
  isAvailable: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}