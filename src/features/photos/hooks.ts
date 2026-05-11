import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create } from 'zustand';
import {
  deletePhoto,
  listPhotosByProperty,
  listPhotosByUnit,
  movePhotosToUnit,
  uploadPhoto,
} from './api';
import type { Photo } from '@/types/db';

const KEYS = {
  byUnit: (unitId: string) => ['photos', 'unit', unitId] as const,
  byProperty: (propertyId: string) => ['photos', 'property', propertyId] as const,
};

export function usePhotosByUnit(unitId: string) {
  return useQuery({
    queryKey: KEYS.byUnit(unitId),
    queryFn: () => listPhotosByUnit(unitId),
    enabled: Boolean(unitId),
  });
}

export function usePhotosByProperty(propertyId: string) {
  return useQuery({
    queryKey: KEYS.byProperty(propertyId),
    queryFn: () => listPhotosByProperty(propertyId),
    enabled: Boolean(propertyId),
  });
}

type UploadVars =
  | { kind: 'unit'; unitId: string; files: File[]; baseSort: number }
  | { kind: 'property'; propertyId: string; files: File[]; baseSort: number };

export function useUploadPhotos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: UploadVars) => {
      const owner = vars.kind === 'unit' ? { unitId: vars.unitId } : { propertyId: vars.propertyId };
      const results: Photo[] = [];
      let i = 0;
      for (const file of vars.files) {
        const p = await uploadPhoto(owner, file, vars.baseSort + i);
        results.push(p);
        i += 1;
      }
      return results;
    },
    onSuccess: (_, vars) => {
      if (vars.kind === 'unit') qc.invalidateQueries({ queryKey: KEYS.byUnit(vars.unitId) });
      else qc.invalidateQueries({ queryKey: KEYS.byProperty(vars.propertyId) });
    },
  });
}

export function useDeletePhoto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deletePhoto,
    onSuccess: (_, photo) => {
      if (photo.unit_id) qc.invalidateQueries({ queryKey: KEYS.byUnit(photo.unit_id) });
      if (photo.property_id) qc.invalidateQueries({ queryKey: KEYS.byProperty(photo.property_id) });
    },
  });
}

type MoveVars = {
  photoIds: string[];
  targetUnitId: string;
  sourceUnitIds: string[];
};

export function useMovePhotos() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ photoIds, targetUnitId }: MoveVars) => movePhotosToUnit(photoIds, targetUnitId),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.byUnit(vars.targetUnitId) });
      for (const src of vars.sourceUnitIds) {
        qc.invalidateQueries({ queryKey: KEYS.byUnit(src) });
      }
    },
  });
}

type PhotoSelectionState = {
  ids: Set<string>;
  docIds: Set<string>;
  toggle: (id: string) => void;
  toggleDoc: (id: string) => void;
  setAll: (ids: string[]) => void;
  clear: () => void;
};

export const usePhotoSelection = create<PhotoSelectionState>((set) => ({
  ids: new Set(),
  docIds: new Set(),
  toggle: (id) =>
    set((s) => {
      const next = new Set(s.ids);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ids: next };
    }),
  toggleDoc: (id) =>
    set((s) => {
      const next = new Set(s.docIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { docIds: next };
    }),
  setAll: (ids) => set({ ids: new Set(ids) }),
  clear: () => set({ ids: new Set(), docIds: new Set() }),
}));
