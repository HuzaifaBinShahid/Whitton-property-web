import { supabase } from '@/lib/supabase';
import type { Property, UtilityKey } from '@/types/db';

export async function listProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getProperty(id: string): Promise<Property> {
  const { data, error } = await supabase.from('properties').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export async function createProperty(input: {
  name: string;
  address?: string | null;
  notes?: string | null;
}): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .insert({ name: input.name, address: input.address ?? null, notes: input.notes ?? null })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export type PropertyPatch = Partial<{
  name: string;
  address: string | null;
  notes: string | null;
  gas_provider: string | null;
  electric_provider: string | null;
  water_provider: string | null;
  council_tax_provider: string | null;
}>;

export async function updateProperty(id: string, patch: PropertyPatch): Promise<Property> {
  const { data, error } = await supabase
    .from('properties')
    .update(patch)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUtility(
  id: string,
  key: UtilityKey,
  value: string | null,
): Promise<Property> {
  return updateProperty(id, { [key]: value } as PropertyPatch);
}

export async function deleteProperty(id: string): Promise<void> {
  const { data: units } = await supabase.from('units').select('id').eq('property_id', id);
  const unitIds = (units ?? []).map((u) => u.id);

  const photoPaths: string[] = [];

  const { data: propertyPhotos } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('property_id', id);
  for (const p of propertyPhotos ?? []) photoPaths.push(p.storage_path);

  if (unitIds.length > 0) {
    const { data: unitPhotos } = await supabase
      .from('photos')
      .select('storage_path')
      .in('unit_id', unitIds);
    for (const p of unitPhotos ?? []) photoPaths.push(p.storage_path);
  }

  const { data: docs } = await supabase
    .from('compliance_documents')
    .select('storage_path')
    .eq('property_id', id);
  const docPaths = (docs ?? []).map((d) => d.storage_path);

  if (photoPaths.length > 0) {
    await supabase.storage.from('unit-photos').remove(photoPaths);
  }
  if (docPaths.length > 0) {
    await supabase.storage.from('compliance-docs').remove(docPaths);
  }

  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw error;
}

export async function getPropertyCoverPath(propertyId: string): Promise<string | null> {
  const { data: propPhoto } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('property_id', propertyId)
    .order('sort_order', { ascending: true })
    .limit(1)
    .maybeSingle();
  if (propPhoto?.storage_path) return propPhoto.storage_path;

  const { data: units } = await supabase
    .from('units')
    .select('id')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true });
  for (const u of units ?? []) {
    const { data: photo } = await supabase
      .from('photos')
      .select('storage_path')
      .eq('unit_id', u.id)
      .order('sort_order', { ascending: true })
      .limit(1)
      .maybeSingle();
    if (photo?.storage_path) return photo.storage_path;
  }
  return null;
}

export async function getPropertyUnitCount(propertyId: string): Promise<number> {
  const { count, error } = await supabase
    .from('units')
    .select('id', { count: 'exact', head: true })
    .eq('property_id', propertyId);
  if (error) throw error;
  return count ?? 0;
}
