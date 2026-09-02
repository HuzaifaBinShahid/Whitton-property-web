import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import { env } from './env';

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const PHOTO_BUCKET = 'unit-photos';
export const COMPLIANCE_BUCKET = 'compliance-docs';

export function getPhotoUrl(storagePath: string): string {
  return supabase.storage.from(PHOTO_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}

export function getThumbUrl(storagePath: string, _width = 400): string {
  return getPhotoUrl(storagePath);
}

export function getDocUrl(storagePath: string): string {
  return supabase.storage.from(COMPLIANCE_BUCKET).getPublicUrl(storagePath).data.publicUrl;
}
