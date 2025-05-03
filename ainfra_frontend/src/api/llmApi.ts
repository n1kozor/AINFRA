// src/api/llmApi.ts
import { llmAxios } from './axiosConfig';
import {DeviceType} from "../types/device";

// Function to map frontend DeviceType to backend format
const mapDeviceTypeForBackend = (deviceType: DeviceType): string => {
  return deviceType === 'standard' ? 'standard_device' : 'custom_device';
};

interface GenerateReportRequest {
  prompt: string;
  target_device_id?: string;
  target_device_name?: string;
  device_type?: string; // Backend expects 'standard_device' or 'custom_device'
  main_api_url?: string;
}

interface StatisticsReportRequest {
  prompt: string;
}

interface GenerateReportResponse {
  output: string;
}

export const llmApi = {
  /**
   * Generate an AI report based on the provided prompt and device information
   * @param prompt The text prompt for report generation
   * @param deviceId Optional device ID to include in the context
   * @param deviceName Optional device name to include in the context
   * @param deviceType Optional device type (standard or custom)
   * @param mainApiUrl Optional API URL override
   * @returns The generated report text
   */
  generateReport: async (
    prompt: string,
    deviceId?: string,
    deviceName?: string,
    deviceType?: DeviceType,
    mainApiUrl?: string
  ): Promise<string> => {
    // Map the device type to backend format if provided
    const mappedDeviceType = deviceType ? mapDeviceTypeForBackend(deviceType) : undefined;

    const request: GenerateReportRequest = {
      prompt,
      ...(deviceId && { target_device_id: deviceId }),
      ...(deviceName && { target_device_name: deviceName }),
      ...(mappedDeviceType && { device_type: mappedDeviceType }),
      ...(mainApiUrl && { main_api_url: mainApiUrl })
    };

    console.log('Sending request to LLM API:', {
      ...request,
      prompt: request.prompt.substring(0, 100) + '...' // Log just the beginning of the prompt
    });

    const response = await llmAxios.post<GenerateReportResponse>('/generate', request);
    return response.data.output;
  },
  /**
   * Generate an AI report focused on system statistics for all devices
   * This endpoint specifically uses only the get_all_system_statistics tool
   *
   * @param prompt The text prompt explaining what statistics to analyze
   * @returns The generated statistics report text
   */
  generateStatisticsReport: async (prompt: string): Promise<string> => {
    const request: StatisticsReportRequest = {
      prompt
    };

    const response = await llmAxios.post<GenerateReportResponse>('/generate_statistics_all', request);
    return response.data.output;
  }
};