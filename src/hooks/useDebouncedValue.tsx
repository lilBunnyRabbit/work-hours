import React from "react";

/**
 * https://github.com/mantinedev/mantine/blob/master/src/mantine-hooks/src/use-debounced-value/use-debounced-value.ts
 */
export function useDebouncedValue<T = unknown>(value: T, wait: number, options = { leading: false }) {
  const [_value, setValue] = React.useState(value);

  const mountedRef = React.useRef(false);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();
  const cooldownRef = React.useRef(false);

  const cancel = () => clearTimeout(timeoutRef.current);

  React.useEffect(() => {
    if (mountedRef.current) {
      if (!cooldownRef.current && options.leading) {
        cooldownRef.current = true;
        setValue(value);
      } else {
        cancel();
        timeoutRef.current = setTimeout(() => {
          cooldownRef.current = false;
          setValue(value);
        }, wait);
      }
    }
  }, [value, options.leading, wait]);

  React.useEffect(() => {
    mountedRef.current = true;
    return cancel;
  }, []);

  return [_value, cancel] as const;
}
