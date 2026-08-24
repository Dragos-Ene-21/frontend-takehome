import { useEffect, useRef } from 'react';

export function useDesktopMarketFocus(onFocus: (marketId: string) => void) {
  const onFocusRef = useRef(onFocus);

  useEffect(() => {
    onFocusRef.current = onFocus;
  });

  useEffect(() => {
    const unsubscribe = window.marketDesktop!.onMarketFocus((marketId) => onFocusRef.current(marketId));
    return unsubscribe;
  }, []);
}
