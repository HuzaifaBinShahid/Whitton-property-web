import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteDocument,
  listByProperty,
  updateExpiry,
  uploadDocument,
} from './api';

const KEYS = {
  byProperty: (propertyId: string) => ['compliance', propertyId] as const,
};

export function useComplianceDocs(propertyId: string) {
  return useQuery({
    queryKey: KEYS.byProperty(propertyId),
    queryFn: () => listByProperty(propertyId),
    enabled: Boolean(propertyId),
  });
}

export function useUploadDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: uploadDocument,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: KEYS.byProperty(vars.propertyId) });
    },
  });
}

export function useDeleteDoc() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteDocument,
    onSuccess: (_, doc) => {
      qc.invalidateQueries({ queryKey: KEYS.byProperty(doc.property_id) });
    },
  });
}

export function useUpdateExpiry(propertyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, expiryDate }: { id: string; expiryDate: string | null }) =>
      updateExpiry(id, expiryDate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.byProperty(propertyId) });
    },
  });
}
