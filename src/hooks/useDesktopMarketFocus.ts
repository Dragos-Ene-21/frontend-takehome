import { useEffect } from 'react';

export function useDesktopMarketFocus(onFocus: (marketId: string) => void) {
  useEffect(() => {
    const unsubscribe = window.marketDesktop!.onMarketFocus((marketId) => onFocus(marketId));
    return unsubscribe;
  }, []);
}
