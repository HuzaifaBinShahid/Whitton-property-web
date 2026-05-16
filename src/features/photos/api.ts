import { supabase, PHOTO_BUCKET } from '@/lib/supabase';
import type { Photo } from '@/types/db';
import { prepareUpload } from './imagePipeline';

export async function listPhotosByUnit(unitId: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('unit_id', unitId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function listPhotosByProperty(propertyId: string): Promise<Photo[]> {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('property_id', propertyId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

type Owner = { unitId: string } | { propertyId: string };

export async function uploadPhoto(
  owner: Owner,
  file: File,
  sortOrder: number,
): Promise<Photo> {
  const prepared = await prepareUpload(file);
  const ownerSegment = 'unitId' in owner ? `unit/${owner.unitId}` : `property/${owner.propertyId}`;
  const id = crypto.randomUUID();
  const storagePath = `${ownerSegment}/${id}.${prepared.extension}`;

  const { error: upErr } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(storagePath, prepared.blob, {
      contentType: prepared.contentType,
      cacheControl: '3600',
      upsert: false,
    });
  if (upErr) throw upErr;

  const insert: {
    unit_id?: string | null;
    property_id?: string | null;
    storage_path: string;
    sort_order: number;
  } = { storage_path: storagePath, sort_order: sortOrder };
  if ('unitId' in owner) insert.unit_id = owner.unitId;
  else insert.property_id = owner.propertyId;

  const { data, error } = await supabase.from('photos').insert(insert).select().single();
  if (error) {
    await supabase.storage.from(PHOTO_BUCKET).remove([storagePath]);
    throw error;
  }
  return data;
}

export async function deletePhoto(photo: Photo): Promise<void> {
  const { error } = await supabase.from('photos').delete().eq('id', photo.id);
  if (error) throw error;
  await supabase.storage.from(PHOTO_BUCKET).remove([photo.storage_path]);
}

export async function movePhotosToUnit(
  photoIds: string[],
  targetUnitId: string,
): Promise<void> {
  if (photoIds.length === 0) return;
  const { error } = await supabase
    .from('photos')
    .update({ unit_id: targetUnitId })
    .in('id', photoIds);
  if (error) throw error;
}

export async function updatePhotoLabel(id: string, label: string | null): Promise<Photo> {
  const { data, error } = await supabase
    .from('photos')
    .update({ label })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function setPhotoAsCover(photo: Photo): Promise<void> {
  if (photo.unit_id) {
    const { error: clearErr } = await supabase
      .from('photos')
      .update({ is_cover: false })
      .eq('unit_id', photo.unit_id)
      .neq('id', photo.id);
    if (clearErr) throw clearErr;
  } else if (photo.property_id) {
    const { error: clearErr } = await supabase
      .from('photos')
      .update({ is_cover: false })
      .eq('property_id', photo.property_id)
      .neq('id', photo.id);
    if (clearErr) throw clearErr;
  } else {
    throw new Error('Photo has no owner');
  }
  const { error } = await supabase
    .from('photos')
    .update({ is_cover: true })
    .eq('id', photo.id);
  if (error) throw error;
}
