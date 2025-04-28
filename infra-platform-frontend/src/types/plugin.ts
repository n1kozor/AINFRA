export interface Plugin {
  id: number;
  name: string;
  description: string | null;
  version: string;
  author: string | null;
  code: string;
  ui_schema: Record<string, any>;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface PluginCreate {
  name: string;
  description?: string;
  version: string;
  author?: string;
  code: string;
  ui_schema: Record<string, any>;
}

export interface PluginUpdate {
  name?: string;
  description?: string;
  version?: string;
  author?: string;
  code?: string;
  ui_schema?: Record<string, any>;
  is_active?: boolean;
}

export interface PluginOperation {
  id: string;
  name: string;
  description: string;
  params: string[];
}

