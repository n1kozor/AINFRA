import React, { useState } from 'react';
import { Box, IconButton, Typography, useTheme, Collapse, Paper } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';

interface JsonViewerProps {
  src: any;
  collapsed?: boolean;
  name?: string;
  enableClipboard?: boolean;
  displayDataTypes?: boolean;
  theme?: 'light' | 'dark';
  style?: React.CSSProperties;
}

const JsonViewer: React.FC<JsonViewerProps> = ({
  src,
  collapsed = false,
  name,
  enableClipboard = true,
  displayDataTypes = false,
  style = {},
}) => {
  const theme = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  const [copied, setCopied] = useState(false);

  const getValueColor = (value: any) => {
    if (value === null) return theme.palette.error.main;
    switch (typeof value) {
      case 'number':
        return theme.palette.primary.main;
      case 'boolean':
        return theme.palette.warning.main;
      case 'string':
        return theme.palette.success.main;
      default:
        return theme.palette.text.primary;
    }
  };

  const getDataTypeText = (value: any) => {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(src, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderValue = (value: any) => {
    if (value === null) {
      return <span style={{ color: getValueColor(value) }}>null</span>;
    }

    if (typeof value === 'object') {
      return isCollapsed ? (
        <Typography variant="body2" component="span" color="text.secondary">
          {Array.isArray(value)
            ? `Array(${value.length})`
            : `Object(${Object.keys(value).length})`}
        </Typography>
      ) : (
        renderObject(value)
      );
    }

    if (typeof value === 'string') {
      return <span style={{ color: getValueColor(value) }}>"{value}"</span>;
    }

    return <span style={{ color: getValueColor(value) }}>{String(value)}</span>;
  };

  const renderObject = (obj: any) => {
    if (obj === null) return null;

    const entries = Array.isArray(obj)
      ? obj.map((value, index) => [index, value])
      : Object.entries(obj);

    return (
      <Box
        sx={{
          pl: 2,
          borderLeft: `1px dashed ${theme.palette.divider}`,
          ml: 1
        }}
      >
        {entries.map(([key, value]) => (
          <Box key={key} sx={{ mt: 0.5 }}>
            <Box display="flex" alignItems="flex-start">
              <Typography
                variant="body2"
                component="span"
                color="text.secondary"
                fontWeight="bold"
              >
                {key}:
              </Typography>
              <Box component="span" sx={{ ml: 0.5, display: 'flex', alignItems: 'center' }}>
                {renderValue(value)}
                {displayDataTypes && (
                  <Typography
                    variant="caption"
                    component="span"
                    color="text.disabled"
                    sx={{ ml: 1 }}
                  >
                    ({getDataTypeText(value)})
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        bgcolor: theme.palette.mode === 'dark'
          ? 'rgba(0, 0, 0, 0.2)'
          : 'rgba(0, 0, 0, 0.03)',
        borderRadius: 1,
        ...style
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {typeof src === 'object' && src !== null && (
            <IconButton
              size="small"
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{ mr: 1 }}
            >
              {isCollapsed ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </IconButton>
          )}

          {name && (
            <Typography
              variant="body2"
              component="span"
              color="text.secondary"
              fontWeight="bold"
              sx={{ mr: 1 }}
            >
              {name}:
            </Typography>
          )}
        </Box>

        {enableClipboard && (
          <IconButton size="small" onClick={handleCopy} color={copied ? 'success' : 'default'}>
            {copied ? <CheckIcon fontSize="small" /> : <CopyIcon fontSize="small" />}
          </IconButton>
        )}
      </Box>

      <Collapse in={!isCollapsed || typeof src !== 'object' || src === null}>
        {typeof src === 'object' && src !== null ? (
          renderObject(src)
        ) : (
          renderValue(src)
        )}
      </Collapse>
    </Paper>
  );
};

export default JsonViewer;