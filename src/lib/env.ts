const url =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://perlbmalzuhyvtkkpclz.supabase.co';

const anonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlcmxibWFsenVoeXZ0a2twY2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDg3NDEsImV4cCI6MjA5MzkyNDc0MX0.IerW05QFKG73RiwWkrY0DKIYPty-5vcobypgMbJC-GQ';

export const env = {
  supabaseUrl: url,
  supabaseAnonKey: anonKey,
} as const;

