import { supabase } from '@/lib/supabase';
import type { SentEmail } from '@/types/db';

export async function getCounts(): Promise<{
  properties: number;
  units: number;
  photos: number;
  emails: number;
}> {
  const [props, units, photos, emails] = await Promise.all([
    supabase.from('properties').select('id', { count: 'exact', head: true }),
    supabase.from('units').select('id', { count: 'exact', head: true }),
    supabase.from('photos').select('id', { count: 'exact', head: true }),
    supabase.from('sent_emails').select('id', { count: 'exact', head: true }),
  ]);
  return {
    properties: props.count ?? 0,
    units: units.count ?? 0,
    photos: photos.count ?? 0,
    emails: emails.count ?? 0,
  };
}

export async function listRecentEmails(limit = 20): Promise<SentEmail[]> {
  const { data, error } = await supabase
    .from('sent_emails')
    .select('*')
    .order('sent_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function logSentEmail(input: {
  property_id: string | null;
  unit_id: string | null;
  subject: string | null;
  photo_count: number;
}): Promise<SentEmail> {
  const { data, error } = await supabase.from('sent_emails').insert(input).select().single();
  if (error) throw error;
  return data;
}
