import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getCounts, listRecentEmails, logSentEmail } from './api';

const KEYS = {
  counts: ['stats', 'counts'] as const,
  recent: ['stats', 'recent'] as const,
};

export function useStatsCounts() {
  return useQuery({ queryKey: KEYS.counts, queryFn: getCounts });
}

export function useRecentEmails() {
  return useQuery({ queryKey: KEYS.recent, queryFn: () => listRecentEmails(20) });
}

export function useLogSentEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: logSentEmail,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEYS.counts });
      qc.invalidateQueries({ queryKey: KEYS.recent });
    },
  });
}
