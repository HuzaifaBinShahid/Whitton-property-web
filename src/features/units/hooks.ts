import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createUnit,
  deleteUnit,
  getUnit,
  listUnitsByProperty,
  updateUnit,
  type UnitPatch,
} from './api';

const KEYS = {
  byProperty: (propertyId: string) => ['units', { propertyId }] as const,
  detail: (id: string) => ['unit', id] as const,
};

export function useUnitsByProperty(propertyId: string) {
  return useQuery({
    queryKey: KEYS.byProperty(propertyId),
    queryFn: () => listUnitsByProperty(propertyId),
    enabled: Boolean(propertyId),
  });
}

export function useUnit(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => getUnit(id),
    enabled: Boolean(id),
  });
}

export function useCreateUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUnit,
    onSuccess: (unit) => {
      qc.invalidateQueries({ queryKey: KEYS.byProperty(unit.property_id) });
    },
  });
}

export function useUpdateUnit(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: UnitPatch) => updateUnit(id, patch),
    onSuccess: (unit) => {
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: KEYS.byProperty(unit.property_id) });
    },
  });
}

export function useDeleteUnit(propertyId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUnit,
    onSuccess: () => {
      if (propertyId) qc.invalidateQueries({ queryKey: KEYS.byProperty(propertyId) });
    },
  });
}
