import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
  if (!supabaseInstance) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Secrets panel.');
      // Return a dummy client or throw a more descriptive error
      // Throwing here will still crash but with a better message if called
      throw new Error('Supabase URL and Anon Key are required. Please configure them in the Secrets panel.');
    }

    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabaseInstance;
};

// For backward compatibility with existing imports, we can use a Proxy
// but it's cleaner to just update the imports to use the function or a getter.
// However, to minimize changes across many files, let's use a getter.
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabase();
    return (client as any)[prop];
  }
});
