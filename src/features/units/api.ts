import { supabase } from '@/lib/supabase';
import type { Unit, UnitCategory } from '@/types/db';

export async function listUnitsByProperty(propertyId: string): Promise<Unit[]> {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getUnit(id: string): Promise<Unit> {
  const { data, error } = await supabase.from('units').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export type UnitDimensionsPatch = Partial<{
  room_length_m: number | null;
  room_width_m: number | null;
  toilet_length_m: number | null;
  toilet_width_m: number | null;
  living_kitchen_length_m: number | null;
  living_kitchen_width_m: number | null;
}>;

export type UnitPatch = UnitDimensionsPatch &
  Partial<{
    name: string;
    category: UnitCategory;
    notes: string | null;
  }>;

export async function createUnit(input: {
  property_id: string;
  name: string;
  category: UnitCategory;
  notes?: string | null;
  dimensions?: UnitDimensionsPatch;
}): Promise<Unit> {
  const { data, error } = await supabase
    .from('units')
    .insert({
      property_id: input.property_id,
      name: input.name,
      category: input.category,
      notes: input.notes ?? null,
      ...(input.dimensions ?? {}),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateUnit(id: string, patch: UnitPatch): Promise<Unit> {
  const { data, error } = await supabase.from('units').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteUnit(id: string): Promise<void> {
  const { data: photos } = await supabase
    .from('photos')
    .select('storage_path')
    .eq('unit_id', id);
  const paths = (photos ?? []).map((p) => p.storage_path).filter(Boolean);
  if (paths.length > 0) {
    await supabase.storage.from('unit-photos').remove(paths);
  }
  const { error } = await supabase.from('units').delete().eq('id', id);
  if (error) throw error;
}
