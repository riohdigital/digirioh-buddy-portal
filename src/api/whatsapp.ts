
// This file would be used by your backend service (Edge Function, etc.)
// This is a simplified version for demonstration

import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

// Use service role key for admin operations
const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

export async function generateWhatsappCode(userId: string): Promise<string> {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Set expiry to 15 minutes from now
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);
  
  // Save the code to the database
  await supabase
    .from('whatsapp_linking_codes')
    .insert({
      code,
      user_id: userId,
      expires_at: expiresAt.toISOString(),
    });
    
  return code;
}

export async function unlinkWhatsapp(userId: string): Promise<void> {
  await supabase
    .from('profiles')
    .update({ whatsapp_jid: null })
    .eq('id', userId);
}
