import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../api';
import { PluginCreate } from '../../types/plugin';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const usePluginActions = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPluginId, setSelectedPluginId] = useState<number | null>(null);

  const createMutation = useMutation({
    mutationFn: (data: PluginCreate) => api.plugins.create(data),
    onSuccess: (plugin) => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      navigate(`/plugins/${plugin.id}`);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PluginCreate> }) =>
      api.plugins.update(id, data),
    onSuccess: (plugin) => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      queryClient.invalidateQueries({ queryKey: ['plugin', plugin.id] });
      navigate(`/plugins/${plugin.id}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.plugins.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plugins'] });
      setDeleteDialogOpen(false);
      navigate('/plugins');
    },
  });

  const handleDeleteClick = (id: number, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setSelectedPluginId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPluginId !== null) {
      deleteMutation.mutate(selectedPluginId);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSelectedPluginId(null);
  };

  return {
    createMutation,
    updateMutation,
    deleteMutation,
    deleteDialogOpen,
    selectedPluginId,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
  };
};