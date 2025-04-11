
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json"
};

// Handle preflight OPTIONS request
function handleOptions(req: Request) {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  return null;
}

serve(async (req) => {
  // Handle CORS preflight request
  const preflightResponse = handleOptions(req);
  if (preflightResponse) return preflightResponse;

  try {
    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { 
          status: 400, 
          headers: corsHeaders
        }
      );
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiry to 10 minutes from now
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);
    
    // Delete any existing codes for this user
    await supabase
      .from('whatsapp_linking_codes')
      .delete()
      .eq('user_id', userId);
    
    // Insert the new code
    const { error } = await supabase
      .from('whatsapp_linking_codes')
      .insert({
        code,
        user_id: userId,
        expires_at: expiresAt.toISOString(),
      });
    
    if (error) {
      console.error("Error inserting WhatsApp linking code:", error);
      return new Response(
        JSON.stringify({ error: "Failed to generate WhatsApp code" }),
        { 
          status: 500, 
          headers: corsHeaders
        }
      );
    }
    
    // Return the code
    return new Response(
      JSON.stringify({ code }),
      { 
        status: 200, 
        headers: corsHeaders
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { 
        status: 500, 
        headers: corsHeaders
      }
    );
  }
});
