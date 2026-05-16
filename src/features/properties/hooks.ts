import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createProperty,
  deleteProperty,
  getProperty,
  getPropertyCoverPath,
  getPropertyUnitCount,
  getUnitCoverPath,
  listProperties,
  updateProperty,
  type PropertyPatch,
} from './api';

const KEYS = {
  list: ['properties'] as const,
  detail: (id: string) => ['property', id] as const,
  cover: (id: string) => ['property-cover', id] as const,
  unitCover: (id: string) => ['unit-cover', id] as const,
  unitCount: (id: string) => ['property-unit-count', id] as const,
};

export function useProperties() {
  return useQuery({ queryKey: KEYS.list, queryFn: listProperties });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => getProperty(id),
    enabled: Boolean(id),
  });
}

export function usePropertyCover(id: string) {
  return useQuery({
    queryKey: KEYS.cover(id),
    queryFn: () => getPropertyCoverPath(id),
    enabled: Boolean(id),
  });
}

export function useUnitCover(id: string) {
  return useQuery({
    queryKey: KEYS.unitCover(id),
    queryFn: () => getUnitCoverPath(id),
    enabled: Boolean(id),
  });
}

export function usePropertyUnitCount(id: string) {
  return useQuery({
    queryKey: KEYS.unitCount(id),
    queryFn: () => getPropertyUnitCount(id),
    enabled: Boolean(id),
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
    },
  });
}

export function useUpdateProperty(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (patch: PropertyPatch) => updateProperty(id, patch),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: KEYS.list });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.list });
    },
  });
}
