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
  Paper
} from '@mui/material';
import {
  CodeRounded as CodeIcon,
  AccountTreeRounded as SchemaIcon,
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
    if (plugin && plugin.code) {
      navigator.clipboard.writeText(plugin.code);
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

  const handleDownloadCode = () => {
    if (plugin && plugin.code) {
      const element = document.createElement('a');
      const file = new Blob([plugin.code], { type: 'text/javascript' });
      element.href = URL.createObjectURL(file);
      element.download = `${plugin.name.replace(/\s+/g, '_').toLowerCase()}_v${plugin.version}.js`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleDownloadSchema = () => {
    if (plugin && plugin.ui_schema) {
      const element = document.createElement('a');
      const file = new Blob([JSON.stringify(plugin.ui_schema, null, 2)], { type: 'application/json' });
      element.href = URL.createObjectURL(file);
      element.download = `${plugin.name.replace(/\s+/g, '_').toLowerCase()}_schema_v${plugin.version}.json`;
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
      >
        <Tab
          icon={<CodeIcon />}
          iconPosition="start"
          label={t('plugins:tabs.code')}
        />
        {plugin.ui_schema && Object.keys(plugin.ui_schema).length > 0 && (
          <Tab
            icon={<SchemaIcon />}
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
            <Paper sx={{ mt: 2, overflow: 'hidden' }}>
              <Box sx={{
                p: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {plugin.name} - v{plugin.version}
                </Typography>
                <Box>
                  <Tooltip title={codeCopied ? t('plugins:copied') : t('plugins:copy')}>
                    <IconButton size="small" onClick={handleCopyCode}>
                      {codeCopied ? <CheckIcon /> : <ClipboardIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('plugins:download')}>
                    <IconButton size="small" onClick={handleDownloadCode}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Editor
                height="500px"
                language="javascript"
                value={plugin.code || '// No code available'}
                theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </Paper>
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
            <Paper sx={{ mt: 2, overflow: 'hidden' }}>
              <Box sx={{
                p: 1.5,
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {t('plugins:uiSchema')}
                </Typography>
                <Box>
                  <Tooltip title={schemaCopied ? t('plugins:copied') : t('plugins:copy')}>
                    <IconButton size="small" onClick={handleCopySchema}>
                      {schemaCopied ? <CheckIcon /> : <ClipboardIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('plugins:download')}>
                    <IconButton size="small" onClick={handleDownloadSchema}>
                      <DownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              <Editor
                height="500px"
                language="json"
                value={JSON.stringify(plugin.ui_schema, null, 2)}
                theme={theme.palette.mode === 'dark' ? 'vs-dark' : 'light'}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  wordWrap: 'on',
                  automaticLayout: true,
                }}
              />
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default PluginDetailTabs;