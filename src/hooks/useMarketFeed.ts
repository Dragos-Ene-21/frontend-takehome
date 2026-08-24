import { useEffect, useState } from 'react';
import type { Desk, MarketQuote } from '../types';
import { marketFeed } from '../lib/marketFeed';

export function useMarketFeed(desk: Desk) {
  const [quotes, setQuotes] = useState<MarketQuote[]>(() =>
    marketFeed.getSnapshot(desk)
  );

  useEffect(() => {
    setQuotes(marketFeed.getSnapshot(desk));

    const unsubscribe = marketFeed.subscribe(desk, (update) => {
      setQuotes((prev) =>
        prev.map((quote) =>
          quote.id === update.id ? { ...quote, ...update } : quote
        )
      );
    });

    return unsubscribe;
  }, [desk]);

  return quotes;
}

