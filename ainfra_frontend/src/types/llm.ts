// src/types/llm.ts
export interface LLMModel {
  id: string;
  name: string;
  provider: string;
}

export interface LLMSettings {
  openai_api_key: string;
  default_model: string;
  mcp_base_url: string;
}

export interface ModelsList {
  models: LLMModel[];
}

export interface LLMReportRequest {
  prompt: string;
  model?: string;
  target_device_id?: string;
  target_device_name?: string;
  device_type?: string;
}

export interface LLMStatisticsRequest {
  prompt: string;
  model?: string;
}

export interface LLMReportResponse {
  output: string;
}