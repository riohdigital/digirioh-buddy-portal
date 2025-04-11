
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
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          whatsapp_jid: string | null
          role: 'admin' | 'basic_user'
          google_refresh_token: string | null
          plan: 'free' | 'pro' | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          whatsapp_jid?: string | null
          role?: 'admin' | 'basic_user'
          google_refresh_token?: string | null
          plan?: 'free' | 'pro' | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          whatsapp_jid?: string | null
          role?: 'admin' | 'basic_user'
          google_refresh_token?: string | null
          plan?: 'free' | 'pro' | null
        }
      }
      whatsapp_linking_codes: {
        Row: {
          id: string
          created_at: string
          code: string
          user_id: string
          expires_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          code: string
          user_id: string
          expires_at: string
        }
        Update: {
          id?: string
          created_at?: string
          code?: string
          user_id?: string
          expires_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type WhatsappLinkingCode = Database['public']['Tables']['whatsapp_linking_codes']['Row']
