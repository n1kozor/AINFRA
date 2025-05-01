// src/api/llmApi.ts
import { llmAxios } from './axiosConfig';

interface GenerateReportRequest {
  prompt: string;
  target_device_id?: string;
  target_device_name?: string;
  main_api_url?: string;
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
   * @param mainApiUrl Optional API URL override
   * @returns The generated report text
   */
  generateReport: async (
    prompt: string,
    deviceId?: string,
    deviceName?: string,
    mainApiUrl?: string
  ): Promise<string> => {
    const request: GenerateReportRequest = {
      prompt,
      ...(deviceId && { target_device_id: deviceId }),
      ...(deviceName && { target_device_name: deviceName }),
      ...(mainApiUrl && { main_api_url: mainApiUrl })
    };

    const response = await llmAxios.post<GenerateReportResponse>('/generate', request);
    return response.data.output;
  },

  /**
   * Alternative method accepting a config object
   */
  generateReportWithConfig: async (config: GenerateReportRequest): Promise<string> => {
    const response = await llmAxios.post<GenerateReportResponse>('/generate', config);
    return response.data.output;
  }
};