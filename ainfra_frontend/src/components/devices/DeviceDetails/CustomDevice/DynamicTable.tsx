import React from 'react';
import {
  Box, Button, Table, TableContainer, TableHead, TableBody,
  TableRow, TableCell, Paper, Chip, useTheme
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, Storage as StorageIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import CardContainer from './CardContainer';

interface DynamicTableProps {
  title: string;
  data: any[];
  actions?: Array<{
    title: string;
    action: string;
    buttonType?: string;
    enabledWhen?: string;
  }>;
  onAction: (actionId: string, rowData: any) => void;
  onRefresh?: () => void;
}

const DynamicTable: React.FC<DynamicTableProps> = ({
  title,
  data,
  actions = [],
  onAction,
  onRefresh
}) => {
  const theme = useTheme();
  useTranslation(['common']);

  if (!data || data.length === 0) return null;

  // Generate columns from first item
  const columns = Object.keys(data[0])
    .filter(colKey => typeof data[0][colKey] !== 'object') // Only simple types
    .map(colKey => ({
      key: colKey,
      title: colKey.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    }));

  // Check if status is positive
  const isPositiveStatus = (status: string): boolean => {
    if (!status || typeof status !== 'string') return false;
    const positiveKeywords = ['online', 'active', 'running', 'up', 'connected', 'enabled', 'ok', 'healthy'];
    return positiveKeywords.some(keyword => status.toLowerCase().includes(keyword));
  };

  return (
    <CardContainer
      title={title}
      icon={<StorageIcon />}
      color={theme.palette.info.main}
      onRefresh={onRefresh}
    >
      <TableContainer component={Paper} sx={{ boxShadow: 'none', borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(col => (
                <TableCell key={col.key}>
                  {col.title}
                </TableCell>
              ))}
              {actions.length > 0 && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                {columns.map(col => (
                  <TableCell key={col.key}>
                    {typeof row[col.key] === 'boolean' ?
                      (row[col.key] ? <CheckIcon color="success" /> : <CloseIcon color="error" />) :
                      (col.key === 'status' ?
                        <Chip
                          size="small"
                          label={row[col.key]}
                          color={isPositiveStatus(row[col.key]) ? 'success' : 'default'}
                        /> :
                        row[col.key]
                      )
                    }
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {actions.map((action, actionIndex) => {
                        // Check if button should be enabled for this row
                        let isEnabled = true;
                        if (action.enabledWhen) {
                          try {
                            const evalStr = action.enabledWhen
                              .replace(/row\.(\w+)/g, (_match, field) => {
                                if (typeof row[field] === 'string') {
                                  return `"${row[field]}"`;
                                }
                                return row[field];
                              });
                            // Use Function instead of eval for better safety
                            isEnabled = new Function('return ' + evalStr)();
                          } catch (e) {
                            console.error('Error evaluating button condition:', e);
                            isEnabled = false;
                          }
                        }

                        return isEnabled ? (
                          <Button
                            key={actionIndex}
                            size="small"
                            variant="outlined"
                            color={action.buttonType === 'primary' ? 'primary' :
                                   action.buttonType === 'success' ? 'success' :
                                   action.buttonType === 'warning' ? 'warning' :
                                   action.buttonType === 'error' ? 'error' : 'secondary'}
                            onClick={() => onAction(action.action, row)}
                            sx={{ borderRadius: 1, minWidth: 'auto', padding: '3px 8px' }}
                          >
                            {action.title}
                          </Button>
                        ) : null;
                      })}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </CardContainer>
  );
};

export default DynamicTable;