import { createHash } from 'crypto';
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

  const configKey = createHash('sha256')
    .update(`${supabaseUrl}:${supabaseKey}`)
    .digest('hex');
  const cache = (globalSupabase.__supabaseClientCache ??= {});

  if (cache.client && cache.configKey === configKey) {
    return cache.client;
  }

  const client = createClient(supabaseUrl, supabaseKey);
  cache.client = client;
  cache.configKey = configKey;
  return client;
}
