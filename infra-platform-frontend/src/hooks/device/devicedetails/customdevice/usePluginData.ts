import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../api';
import { Plugin } from '../../../../types/plugin';

export const usePluginData = (pluginId?: string) => {
  const {
    data: plugin,
    isLoading: pluginLoading
  } = useQuery({
    queryKey: ['plugin', pluginId],
    queryFn: () => (pluginId ? api.plugins.getById(Number(pluginId)) : null),
    enabled: !!pluginId,
  });

  const extractOperations = (pluginData: Plugin | null | undefined) => {
    if (!pluginData) return [];

    if (pluginData.ui_schema?.operations && Array.isArray(pluginData.ui_schema.operations)) {
      return pluginData.ui_schema.operations;
    }

    if (pluginData.code) {
      try {
        const operationsMatch = pluginData.code.match(/get_operations\(\)[\s\S]*?return\s+([\s\S]*?)\n\s*\}/);
        if (operationsMatch && operationsMatch[1]) {
          const operationsStr = operationsMatch[1]
              .replace(/'/g, '"')
              .replace(/(\w+):/g, '"$1":')
              .replace(/,\s*}/g, '}')
              .replace(/,\s*]/g, ']');

          try {
            return JSON.parse(operationsStr);
          } catch (parseError) {
            console.error('Failed to parse operations string:', parseError);
            return [];
          }
        }
      } catch (e) {
        console.error('Failed to extract operations:', e);
      }
    }

    return [];
  };

  const getQuickActionButtons = () => {
    if (!plugin?.ui_schema?.buttons) return [];
    return plugin.ui_schema.buttons.map((button: any) => ({
      title: button.title,
      action: button.action,
      variant: button.variant || 'primary',
      icon: button.icon,
      confirm: button.confirm
    }));
  };

  return {
    plugin,
    isLoading: pluginLoading,
    availableOperations: extractOperations(plugin),
    quickActions: getQuickActionButtons()
  };
};