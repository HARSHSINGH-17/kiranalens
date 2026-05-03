import { createClient, type SupabaseClient } from '@supabase/supabase-js';

type SupabaseGlobalCache = {
  client?: SupabaseClient;
  configKey?: string;
};

const globalSupabase = globalThis as typeof globalThis & {
  __supabaseClientCache?: SupabaseGlobalCache;
};

export function getSupabaseClient(): SupabaseClient | null {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  // Cache by URL; if the key changes, a process restart is required to refresh.
  const configKey = supabaseUrl;
  const cache = (globalSupabase.__supabaseClientCache ??= {});

  if (cache.client && cache.configKey === configKey) {
    return cache.client;
  }

  const client = createClient(supabaseUrl, supabaseKey);
  cache.client = client;
  cache.configKey = configKey;
  return client;
}
