import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  IconButton,
  Tooltip,
  alpha,
  useTheme,
  Avatar
} from '@mui/material';
import {
  CodeRounded as CodeIcon,
  AccountTreeRounded as SchemaIcon,
  InfoOutlined as InfoIcon,
  ContentCopyRounded as ClipboardIcon,
  CheckCircleRounded as CheckIcon,
  DownloadRounded as DownloadIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'framer-motion';

interface PluginDetailTabsProps {
  plugin: any;
}

const PluginDetailTabs: React.FC<PluginDetailTabsProps> = ({ plugin }) => {
  const { t } = useTranslation(['plugins', 'common']);
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [codeCopied, setCodeCopied] = useState(false);
  const [schemaCopied, setSchemaCopied] = useState(false);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCopyCode = () => {
    if (plugin && plugin.config) {
      navigator.clipboard.writeText(plugin.config);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  const handleCopySchema = () => {
    if (plugin?.ui_schema) {
      navigator.clipboard.writeText(JSON.stringify(plugin.ui_schema, null, 2));
      setSchemaCopied(true);
      setTimeout(() => setSchemaCopied(false), 2000);
    }
  };

  const handleDownloadConfig = () => {
    if (plugin && plugin.config) {
      const element = document.createElement('a');
      const file = new Blob([plugin.config], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `${plugin.name.replace(/\s+/g, '_').toLowerCase()}_v${plugin.version}.json`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <Box>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="plugin tabs"
        sx={{
          mb: 2,
          '& .MuiTab-root': {
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: '10px 10px 0 0',
            minHeight: '48px',
          },
          '& .Mui-selected': {
            color: `${theme.palette.primary.main} !important`,
            bgcolor: `${alpha(theme.palette.primary.main, 0.08)} !important`,
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0',
          },
        }}
      >
        <Tab
          icon={<CodeIcon sx={{ fontSize: '1.1rem' }} />}
          iconPosition="start"
          label={t('plugins:tabs.configuration')}
        />
        {plugin.ui_schema && Object.keys(plugin.ui_schema).length > 0 && (
          <Tab
            icon={<SchemaIcon sx={{ fontSize: '1.1rem' }} />}
            iconPosition="start"
            label={t('plugins:tabs.uiSchema')}
          />
        )}
      </Tabs>

      <AnimatePresence mode="wait">
        {tabValue === 0 && (
          <motion.div
            key="code-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{
              position: 'relative',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <Box sx={{
                p: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      mr: 1.5,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main
                    }}
                  >
                    <CodeIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle2">
                    {t('plugins:pluginConfiguration')}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title={codeCopied ? t('plugins:copied') : t('plugins:copy')}>
                    <IconButton size="small" onClick={handleCopyCode}>
                      {codeCopied ? <CheckIcon /> : <ClipboardIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('plugins:download')}>
                    <IconButton size="small" onClick={handleDownloadConfig}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Editor
                height="400px"
                language="json"
                value={plugin.config || '{}'}
                theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </Box>
          </motion.div>
        )}

        {tabValue === 1 && plugin.ui_schema && (
          <motion.div
            key="schema-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Box sx={{
              position: 'relative',
              border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
              borderRadius: '10px',
              overflow: 'hidden',
            }}>
              <Box sx={{
                p: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                bgcolor: alpha(theme.palette.background.paper, 0.5),
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      width: 28,
                      height: 28,
                      mr: 1.5,
                      bgcolor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main
                    }}
                  >
                    <SchemaIcon fontSize="small" />
                  </Avatar>
                  <Typography variant="subtitle2">
                    {t('plugins:uiSchema')}
                  </Typography>
                </Box>
                <Box>
                  <Tooltip title={schemaCopied ? t('plugins:copied') : t('plugins:copy')}>
                    <IconButton size="small" onClick={handleCopySchema}>
                      {schemaCopied ? <CheckIcon /> : <ClipboardIcon />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Editor
                height="400px"
                language="json"
                value={JSON.stringify(plugin.ui_schema, null, 2)}
                theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                }}
              />
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default PluginDetailTabs;