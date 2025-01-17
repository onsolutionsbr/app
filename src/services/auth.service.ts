import { User, UserType } from '../types/user';

// Hardcoded admin credentials
const ADMIN_EMAIL = 'admin@admin.com';
const ADMIN_PASSWORD = 'admin123';

export async function login(email: string, password: string): Promise<User> {
  // Check if it's the admin
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return {
      id: '1',
      email: ADMIN_EMAIL,
      userType: UserType.ADMIN
    };
  }
  
  throw new Error('Invalid email or password');
}

export async function signUp(email: string, password: string): Promise<User> {
  throw new Error('Sign up is not available at this time');
}