import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/db';
import { env } from './env';

const customAuthStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem(key) ?? localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') return;
    const rememberMe = localStorage.getItem('whitton_remember_me') === 'true';
    if (rememberMe) {
      localStorage.setItem(key, value);
    } else {
      sessionStorage.setItem(key, value);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  },
};

export const supabase = createClient<Database>(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: customAuthStorage,
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
