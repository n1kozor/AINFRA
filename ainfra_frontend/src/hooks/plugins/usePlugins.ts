import { useQuery } from '@tanstack/react-query';
import { api } from '../../api';

export const usePlugins = (filterOptions = {}) => {
  return useQuery({
    queryKey: ['plugins', filterOptions],
    queryFn: api.plugins.getAll,
    refetchInterval: 30000,
  });
};

export const usePlugin = (id: number | undefined) => {
  return useQuery({
    queryKey: ['plugin', id],
    queryFn: () => api.plugins.getById(id as number),
    enabled: !!id,
  });
};