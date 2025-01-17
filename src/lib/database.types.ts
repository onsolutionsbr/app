export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          phone: string | null
          document: string | null
          user_type: 'admin' | 'professional' | 'client'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          phone?: string | null
          document?: string | null
          user_type: 'admin' | 'professional' | 'client'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          phone?: string | null
          document?: string | null
          user_type?: 'admin' | 'professional' | 'client'
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          description: string
          service_type: 'remote' | 'inPerson' | 'both'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          description: string
          service_type: 'remote' | 'inPerson' | 'both'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string
          service_type?: 'remote' | 'inPerson' | 'both'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      required_fields: {
        Row: {
          id: string
          category_id: string
          name: string
          field_type: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox'
          required: boolean
          validation_pattern: string | null
          validation_message: string | null
          options: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          field_type: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox'
          required?: boolean
          validation_pattern?: string | null
          validation_message?: string | null
          options?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          field_type?: 'text' | 'number' | 'date' | 'select' | 'file' | 'checkbox'
          required?: boolean
          validation_pattern?: string | null
          validation_message?: string | null
          options?: string[] | null
          created_at?: string
        }
      }
      location_types: {
        Row: {
          id: string
          name: string
          description: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      category_location_types: {
        Row: {
          category_id: string
          location_type_id: string
          created_at: string
        }
        Insert: {
          category_id: string
          location_type_id: string
          created_at?: string
        }
        Update: {
          category_id?: string
          location_type_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}