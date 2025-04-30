import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../api';
import { Plugin } from '../../../../types/plugin';

export const usePluginData = (pluginId?: string) => {
  const {
    data: plugin,
    isLoading: pluginLoading
  } = useQuery({
    queryKey: ['plugin', pluginId],
    queryFn: () => (pluginId ? api.plugins.getById(pluginId) : null),
    enabled: !!pluginId,
  });

  // Extract operations from plugin
  const extractOperations = (plugin: Plugin | undefined) => {
    if (!plugin) return [];

    // First check if operations are directly available in the plugin object
    if (plugin.operations && Array.isArray(plugin.operations)) {
      return plugin.operations;
    }

    // Try to extract operations from code
    if (plugin.code) {
      try {
        // Look for get_operations method in the code
        const operationsMatch = plugin.code.match(/get_operations\(\)[\s\S]*?return\s+([\s\S]*?)\n\s*\}/);
        if (operationsMatch && operationsMatch[1]) {
          // Basic parser
          const operationsStr = operationsMatch[1]
            .replace(/'/g, '"')
            .replace(/(\w+):/g, '"$1":')
            .replace(/,\s*}/g, '}')  // Fix trailing commas
            .replace(/,\s*]/g, ']'); // Fix trailing commas in arrays

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

  // Get quick action buttons from plugin UI schema
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