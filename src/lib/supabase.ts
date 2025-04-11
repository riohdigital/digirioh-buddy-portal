
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

// These should be environment variables in a production environment
const supabaseUrl = 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

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

export const unlinkWhatsapp = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  return supabase
    .from('profiles')
    .update({ whatsapp_jid: null })
    .eq('id', user.id);
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
  
  const response = await fetch('/api/generate-whatsapp-code', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user.id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to generate WhatsApp code');
  }
  
  return response.json();
};

export const unlinkWhatsappCode = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  
  const response = await fetch('/api/unlink-whatsapp', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user.id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to unlink WhatsApp');
  }
  
  return response.json();
};
