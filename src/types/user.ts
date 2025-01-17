export enum UserType {
  ADMIN = 'admin',
  PROFESSIONAL = 'professional',
  CLIENT = 'client'
}

export interface User {
  id: string;
  email: string;
  password?: string; // Only used internally, never exposed to client
  userType: UserType;
}

export interface Professional extends User {
  name: string;
  services: Service[];
  categories: string[];
  description: string;
  languages: string[];
  rating: number;
  documentsVerified: boolean;
  availability: Availability[];
}

export interface Client extends User {
  name: string;
  favoriteProviders: string[];
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
}

interface Availability {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}