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
  loadingMessage?: string;
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  showLoadingToast?: boolean;
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
        loadingMessage,
        showSuccessToast = false,
        showErrorToast = true,
        showLoadingToast = true,
      } = options;

      setState({ data: null, loading: true, error: null });

      let toastId: string | number | undefined;

      try {
        if (showLoadingToast) {
          toastId = toast.loading(loadingMessage || "Carregando...");
        }

        const result = await apiCall(params);

        setState({ data: result, loading: false, error: null });

        if (toastId !== undefined) {
          toast.success(successMessage || "Sucesso!", { id: toastId });
        } else if (showSuccessToast && successMessage) {
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

        if (toastId !== undefined) {
          toast.error(errorMsg, { id: toastId });
        } else if (showErrorToast) {
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