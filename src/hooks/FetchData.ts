import debounce from 'lodash.debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface FetchData<T> {
  loading: boolean;
  errorLoading: boolean;
  firstLoading: boolean;
  value: T | null;
  fetch: () => Promise<void>;
  resetState: () => void;
}

export function useFetchData<T>(
  callback: () => Promise<T>,
  options?: {
    useEffectDeps?: any[];
    useCallbackDeps?: any[];
    resetValueChanges?: any[];
    appendValue?: { fieldToAppend: string };
    simulateError?: {
      isValueNull?: boolean;
      isError?: boolean;
    };
  },
): FetchData<T> {
  const [loading, setLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [value, setValue] = useState<T | null>(null);
  const [firstLoading, setFirstLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const valueFetched = await Promise.resolve(callback());
      if (options && options.appendValue) {
        const { fieldToAppend } = options.appendValue;
        if (options?.simulateError && options.simulateError.isValueNull) {
          setValue(null);
        } else {
          // @ts-ignore
          setValue((oldState) =>
            oldState
              ? {
                  ...valueFetched,
                  [fieldToAppend]: [
                    // @ts-ignore
                    ...oldState[fieldToAppend],
                    // @ts-ignore
                    ...valueFetched[fieldToAppend],
                  ],
                }
              : valueFetched,
          );
        }
      } else {
        if (options?.simulateError && options.simulateError.isValueNull) {
          setValue(null);
        } else {
          setValue(valueFetched);
        }
      }
      if (options?.simulateError && options.simulateError.isError) {
        setErrorLoading(true);
      } else {
        setErrorLoading(false);
      }
    } catch (error) {
      console.error("🚀 ~ file: FetchData.ts ~ line 68 ~ fetch ~ error", error)
      setErrorLoading(true);
    } finally {
      setLoading(false);
      setFirstLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(options && options.useCallbackDeps ? options.useCallbackDeps : [])]);

  const debounceFetch = useMemo(() => debounce(fetch, 1000), [fetch]);

  const resetState = () => {
    setLoading(true);
    setErrorLoading(false);
    setValue(null);
    debounceFetch();
  };

  if (!options) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      fetch();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      debounceFetch();
      return () => {
        debounceFetch.cancel();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(options.useEffectDeps ? options.useEffectDeps : [debounceFetch])]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      resetState();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...(options.resetValueChanges ? options.resetValueChanges : [])]);
  }

  return { loading, errorLoading, value, firstLoading, fetch, resetState };
}
