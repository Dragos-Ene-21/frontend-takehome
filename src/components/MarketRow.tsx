import { memo, useEffect, useRef, useState } from 'react';
import type { MarketQuote } from '../types';

interface MarketRowProps {
  quote: MarketQuote;
  selected: boolean;
  onSelect: (marketId: string) => void;
}

const priceFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

type FlashDirection = 'up' | 'down' | null;

export const MarketRow = memo(function MarketRow({ quote, selected, onSelect }: MarketRowProps) {
  const renderCount = useRef(0);
  renderCount.current += 1;

  const prevMidRef = useRef((quote.bid + quote.ask) / 2);
  const [flash, setFlash] = useState<FlashDirection>(null);

  useEffect(() => {
    const mid = (quote.bid + quote.ask) / 2;
    const prevMid = prevMidRef.current;
    if (mid !== prevMid) {
      setFlash(mid > prevMid ? 'up' : 'down');
      prevMidRef.current = mid;
      const timeout = window.setTimeout(() => setFlash(null), 900);
      return () => window.clearTimeout(timeout);
    }
  }, [quote.bid, quote.ask]);

  return (
    <button
      className={`market-row ${selected ? 'market-row--selected' : ''} ${
        flash ? `market-row--flash-${flash}` : ''
      }`}
      type="button"
      onClick={() => onSelect(quote.id)}
      aria-pressed={selected}
      data-market-id={quote.id}
      data-render-count={renderCount.current}
    >
      <span className="market-identity">
        <span className="market-code">{quote.market}</span>
        <span className="market-route">{quote.route}</span>
      </span>
      <span className="price price--bid">{priceFormatter.format(quote.bid)}</span>
      <span className="price price--ask">{priceFormatter.format(quote.ask)}</span>
      <span
        className={`change ${quote.change >= 0 ? 'change--up' : 'change--down'}`}
      >
        {quote.change >= 0 ? '+' : ''}
        {quote.change.toFixed(2)}%
      </span>
      <span className="activity" aria-label={`Activity ${quote.activity}%`}>
        <span className="activity-track" aria-hidden="true">
          <span style={{ width: `${quote.activity}%` }} />
        </span>
        <span>{quote.activity}</span>
      </span>
      <span
        className="render-count"
        title="Render count for this row"
        aria-label={`Rendered ${renderCount.current} times`}
      >
        r{renderCount.current}
      </span>
    </button>
  );
});

