import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiOptions<TData, TError> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
  initialLoading?: boolean;
}

export function useApi<TData, TParams extends any[] = any[], TError = Error>(
  apiFunction: (...params: TParams) => Promise<TData>,
  options: UseApiOptions<TData, TError> = {}
) {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<TError | null>(null);
  const [loading, setLoading] = useState(options.initialLoading || false);

  const execute = useCallback(
    async (...params: TParams) => {
      try {
        setLoading(true);
        setError(null);

        const result = await apiFunction(...params);
        setData(result);

        if (options.onSuccess) {
          options.onSuccess(result);
        }

        return result;
      } catch (err) {
        const error = err as TError;
        setError(error);

        if (options.onError) {
          options.onError(error);
        }

        return Promise.reject(error);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    error,
    loading,
    execute,
    reset,
  };
}

export default useApi;