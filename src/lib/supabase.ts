
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// Use the correct Supabase URL and anon key
const supabaseUrl = 'https://uoeshejtkzngnqxtqtbl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvZXNoZWp0a3puZ25xeHRxdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1NTg3NDEsImV4cCI6MjA1OTEzNDc0MX0.URL7EMIL6dqMEJI33ZILQd3pO3AXKAB3zajBQQpx1kc';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const signInWithGoogle = async () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      scopes: 'https://mail.google.com/ https://www.googleapis.com/auth/calendar.events',
    },
  });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  return supabase.auth.getUser();
};

export const getCurrentSession = async () => {
  return supabase.auth.getSession();
};

export const getUserProfile = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  
  return profile;
};

export const generateWhatsappCode = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Get the access token for the function call
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-whatsapp-code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId: user.id }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate WhatsApp code');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error generating WhatsApp code:', error);
    throw error;
  }
};

export const unlinkWhatsapp = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  // Get the access token for the function call
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/unlink-whatsapp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId: user.id }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to unlink WhatsApp');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error unlinking WhatsApp:', error);
    throw error;
  }
};
