import React from "react";

export function useAsyncQuery<TData, TError = unknown>(
  callback: () => TData | Promise<TData>,
  queryKeys: React.DependencyList = []
) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<TError>();
  const [data, setData] = React.useState<TData>();

  const handleExecute = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await Promise.resolve(callback());

      setData(data);
      setError(undefined);
    } catch (error) {
      setError(error as TError);
    }
    setIsLoading(false);
  }, [callback]);

  React.useEffect(() => {
    handleExecute();
  }, [handleExecute, ...queryKeys]);

  return {
    isLoading,
    error,
    data,
    refetch: handleExecute,
  };
}

export function useAsyncMutation<TData, TArgs extends any[] = [], TError = unknown>(
  callback: (...args: TArgs) => TData | Promise<TData>,
  options: { onSuccess?: (data: TData) => void; onError?: (error: any) => void } = {},
  queryKeys: React.DependencyList = []
) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<TError>();

  const handleExecute = React.useCallback(
    async (...args: TArgs): Promise<TData | undefined> => {
      setIsLoading(true);
      try {
        const data = await Promise.resolve(callback(...args));

        setIsLoading(false);
        setError(undefined);

        if (options.onSuccess) options.onSuccess(data);
        return data;
      } catch (error) {
        setError(error as TError);
        if (options.onError) options.onError(error);
      }
      setIsLoading(false);
    },
    [callback, options, ...queryKeys]
  );

  React.useEffect(() => {
    return () => {
      setIsLoading(false);
      setError(undefined);
    };
  }, []);

  return {
    isLoading,
    error,
    execute: handleExecute,
  };
}
