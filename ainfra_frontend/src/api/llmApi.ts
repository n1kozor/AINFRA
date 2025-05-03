// src/api/llmApi.ts
import { llmAxios } from './axiosConfig';
import { DeviceType } from "../types/device";
import { LLMModel, LLMSettings, ModelsList, LLMReportRequest, LLMStatisticsRequest, LLMReportResponse } from "../types/llm";

// Function to map frontend DeviceType to backend format
const mapDeviceTypeForBackend = (deviceType: DeviceType): string => {
  return deviceType === 'standard' ? 'standard_device' : 'custom_device';
};

export const llmApi = {
  /**
   * Generate an AI report based on the provided prompt and device information
   * @param prompt The text prompt for report generation
   * @param deviceId Optional device ID to include in the context
   * @param deviceName Optional device name to include in the context
   * @param deviceType Optional device type (standard or custom)
   * @param model Optional model to use for generation
   * @returns The generated report text
   */
  generateReport: async (
    prompt: string,
    deviceId?: string,
    deviceName?: string,
    deviceType?: DeviceType,
    model?: string
  ): Promise<string> => {
    // Map the device type to backend format if provided
    const mappedDeviceType = deviceType ? mapDeviceTypeForBackend(deviceType) : undefined;

    const request: LLMReportRequest = {
      prompt,
      ...(deviceId && { target_device_id: deviceId }),
      ...(deviceName && { target_device_name: deviceName }),
      ...(mappedDeviceType && { device_type: mappedDeviceType }),
      ...(model && { model })
    };

    console.log('Sending request to LLM API:', {
      ...request,
      prompt: request.prompt.substring(0, 100) + '...' // Log just the beginning of the prompt
    });

    const response = await llmAxios.post<LLMReportResponse>('/generate', request);
    return response.data.output;
  },

  /**
   * Generate an AI report focused on system statistics for all devices
   * This endpoint specifically uses only the get_all_system_statistics tool
   *
   * @param prompt The text prompt explaining what statistics to analyze
   * @param model Optional model to use for generation
   * @returns The generated statistics report text
   */
  generateStatisticsReport: async (prompt: string, model?: string): Promise<string> => {
    const request: LLMStatisticsRequest = {
      prompt,
      ...(model && { model })
    };

    const response = await llmAxios.post<LLMReportResponse>('/generate_statistics_all', request);
    return response.data.output;
  },

  /**
   * Get available LLM models
   * @param refresh Whether to force refresh models from the provider API
   * @returns List of available models
   */
  getModels: async (refresh: boolean = false): Promise<LLMModel[]> => {
    const response = await llmAxios.get<ModelsList>(`/models?refresh=${refresh}`);
    return response.data.models;
  },

  /**
   * Get current LLM settings
   * @returns Current settings object
   */
  getSettings: async (): Promise<LLMSettings> => {
    const response = await llmAxios.get<LLMSettings>('/settings');
    return response.data;
  },

  /**
   * Update LLM settings
   * @param settings Settings object with values to update
   * @returns Updated settings
   */
  updateSettings: async (settings: Partial<LLMSettings>): Promise<LLMSettings> => {
    const response = await llmAxios.post<LLMSettings>('/settings', settings);
    return response.data;
  }
};