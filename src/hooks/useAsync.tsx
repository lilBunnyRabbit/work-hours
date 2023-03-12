import React from "react";

export function useAsync<TData, TError = unknown>(
  initialCallback: () => TData | Promise<TData>,
  queryKeys: React.DependencyList = []
) {
  const [callback] = React.useState<typeof initialCallback>(() => initialCallback);

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<TError>();
  const [data, setData] = React.useState<TData>();

  const handleExecute = React.useCallback(async (callback: () => TData | Promise<TData>) => {
    setIsLoading(true);
    try {
      const data = await Promise.resolve(callback());

      setData(data);
      setError(undefined);
    } catch (error) {
      setError(error as TError);
    }
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    if (callback) handleExecute(callback);
  }, [callback, handleExecute, ...queryKeys]);

  return {
    isLoading,
    error,
    data,
    execute: handleExecute,
  };
}
