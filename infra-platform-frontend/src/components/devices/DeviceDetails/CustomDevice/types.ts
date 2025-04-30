import { ReactNode } from 'react';

export type ValueDisplayType = 'text' | 'status' | 'progress' | 'percentage' | 'bytes' | 'boolean';

export interface DynamicCardProps {
  title: string;
  subtitle?: string;
  value: any;
  type?: ValueDisplayType;
  icon?: ReactNode;
  color?: string;
  onClick?: () => void;
}

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export interface DataDisplayModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: string;
  isLoading?: boolean;
}

export interface OperationModalProps {
  open: boolean;
  onClose: () => void;
  operation: any;
  params: any;
  onParamChange: (param: string, value: string) => void;
  onExecute: () => void;
  isLoading?: boolean;
}

export interface QuickActionsProps {
  actions: Array<{
    title: string;
    action: string;
    variant?: string;
    icon?: string;
    confirm?: boolean;
  }>;
  onAction: (actionId: string, confirm: boolean) => void;
  isLoading?: boolean;
}