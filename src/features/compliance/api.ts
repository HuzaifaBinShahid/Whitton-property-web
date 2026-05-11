import { supabase, COMPLIANCE_BUCKET } from '@/lib/supabase';
import type { ComplianceCategory, ComplianceDocument } from '@/types/db';

export async function listByProperty(propertyId: string): Promise<ComplianceDocument[]> {
  const { data, error } = await supabase
    .from('compliance_documents')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function uploadDocument(input: {
  propertyId: string;
  category: ComplianceCategory;
  file: File;
  name?: string;
  expiryDate?: string | null;
}): Promise<ComplianceDocument> {
  const id = crypto.randomUUID();
  const ext = extFromName(input.file.name) ?? 'pdf';
  const storagePath = `property/${input.propertyId}/${input.category}/${id}.${ext}`;

  const { error: upErr } = await supabase.storage
    .from(COMPLIANCE_BUCKET)
    .upload(storagePath, input.file, {
      contentType: input.file.type || 'application/pdf',
      cacheControl: '3600',
      upsert: false,
    });
  if (upErr) throw upErr;

  const { data, error } = await supabase
    .from('compliance_documents')
    .insert({
      property_id: input.propertyId,
      category: input.category,
      name: input.name?.trim() || input.file.name,
      storage_path: storagePath,
      expiry_date: input.expiryDate ?? null,
    })
    .select()
    .single();
  if (error) {
    await supabase.storage.from(COMPLIANCE_BUCKET).remove([storagePath]);
    throw error;
  }
  return data;
}

export async function deleteDocument(doc: ComplianceDocument): Promise<void> {
  const { error } = await supabase.from('compliance_documents').delete().eq('id', doc.id);
  if (error) throw error;
  await supabase.storage.from(COMPLIANCE_BUCKET).remove([doc.storage_path]);
}

export async function updateExpiry(
  id: string,
  expiryDate: string | null,
): Promise<ComplianceDocument> {
  const { data, error } = await supabase
    .from('compliance_documents')
    .update({ expiry_date: expiryDate })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

function extFromName(name: string): string | null {
  const m = name.match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : null;
}
