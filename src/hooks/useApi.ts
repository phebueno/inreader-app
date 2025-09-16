import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  successMessage?: string;
  errorMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
}

export function useApi<TData = any, TParams = any>() {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (
      apiCall: (params: TParams) => Promise<TData>,
      params: TParams,
      options: UseApiOptions = {}
    ): Promise<TData | null> => {
      const {
        successMessage,
        errorMessage,
        showSuccessToast = false,
        showErrorToast = true,
      } = options;

      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiCall(params);

        setState({ data: result, loading: false, error: null });

        if (showSuccessToast && successMessage) {
          toast.success(successMessage);
        }

        return result;
      } catch (error: any) {
        const errorMsg =
          errorMessage ||
          error.normalizedMessage ||
          error.message ||
          "Ocorreu um erro inesperado";

        setState({ data: null, loading: false, error: errorMsg });

        if (showErrorToast) {
          console.log('here???')
          toast.error(errorMsg);
        }

        return null;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}
