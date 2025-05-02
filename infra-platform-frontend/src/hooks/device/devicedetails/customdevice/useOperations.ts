import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../api';

export const useOperations = (deviceId: string) => {
  const queryClient = useQueryClient();

  const [operationModalOpen, setOperationModalOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<any>(null);
  const [operationParams, setOperationParams] = useState<any>({});
  const [dataModalOpen, setDataModalOpen] = useState(false);
  const [modalData, setModalData] = useState<string>('');
  const [modalTitle, setModalTitle] = useState<string>('');
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingOperation, setPendingOperation] = useState<any>(null);

  // Setup mutation for executing operations
  const operationMutation = useMutation({
    mutationFn: ({ operationId, params }: { operationId: string; params: any }) =>
        api.customDevices.executeOperation(Number(deviceId), operationId, params),
    onSuccess: (data, variables) => {
      // Handle textual data that should be displayed in modal
      if (data && (data.logs || data.output || data.result)) {
        const textContent = data.logs || data.output || JSON.stringify(data.result, null, 2);
        setModalData(textContent);
        setModalTitle(variables.operationId);
        setDataModalOpen(true);
      }

      // Refetch status and metrics after operation
      queryClient.invalidateQueries({ queryKey: ['deviceStatus', deviceId] });
      queryClient.invalidateQueries({ queryKey: ['deviceMetrics', deviceId] });
    },
  });

  // General operation handler that checks if confirmation is needed
  const handleOperation = (operationId: string, params: any = {}, requireConfirm = false, connectionParams = {}) => {
    // Merge connection parameters with provided params
    const fullParams = {
      ...connectionParams,
      ...params,
    };

    if (requireConfirm) {
      // Store operation details and show confirmation dialog
      setPendingOperation({
        operationId,
        params: fullParams
      });
      setConfirmModalOpen(true);
    } else {
      // Execute immediately if no confirmation needed
      operationMutation.mutate({
        operationId,
        params: fullParams
      });
    }
  };

  // Execute confirmed operation
  const executeConfirmedOperation = () => {
    if (pendingOperation) {
      operationMutation.mutate(pendingOperation);
      setPendingOperation(null);
      setConfirmModalOpen(false);
    }
  };

  // Open operation modal for complex operations with parameters
  const openOperationModal = (operation: any) => {
    setSelectedOperation(operation);
    setOperationParams({});
    setOperationModalOpen(true);
  };

  // Execute operation from modal
  const executeOperation = (connectionParams = {}) => {
    if (selectedOperation) {
      // Combine connection parameters with user-provided parameters
      const params = {
        ...connectionParams,
        ...operationParams,
      };

      operationMutation.mutate({
        operationId: selectedOperation.id,
        params,
      });

      setOperationModalOpen(false);
    }
  };

  return {
    operationMutation,
    // Modal states
    operationModalOpen,
    dataModalOpen,
    confirmModalOpen,
    selectedOperation,
    operationParams,
    modalData,
    modalTitle,
    // Modal actions
    setOperationModalOpen,
    setDataModalOpen,
    setConfirmModalOpen,
    setOperationParams,
    // Operation actions
    openOperationModal,
    handleOperation,
    executeOperation,
    executeConfirmedOperation
  };
};