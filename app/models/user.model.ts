export enum UserType {
    ADMIN = 'admin',
    PROFESSIONAL = 'professional',
    CLIENT = 'client'
}

export interface User {
    id: string;
    email: string;
    name: string;
    userType: UserType;
    phoneNumber: string;
    profileImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Professional extends User {
    services: Service[];
    categories: string[];
    description: string;
    languages: string[];
    rating: number;
    documentsVerified: boolean;
    availability: Availability[];
    bankInfo: BankInfo;
}

export interface Client extends User {
    favoriteProviders: string[];
    paymentMethods: PaymentMethod[];
    addresses: Address[];
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

interface BankInfo {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
}

interface PaymentMethod {
    id: string;
    type: string;
    last4: string;
    expiryDate: string;
}

interface Address {
    id: string;
    street: string;
    number: string;
    complement?: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
}