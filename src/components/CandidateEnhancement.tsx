import type { MarketQuote } from '../types';

interface CandidateEnhancementProps {
  quotes: MarketQuote[];
  selectedMarketId: string | null;
  onSelectMarket: (marketId: string) => void;
}

export function CandidateEnhancement({
  quotes: _quotes,
  selectedMarketId: _selectedMarketId,
  onSelectMarket: _onSelectMarket,
}: CandidateEnhancementProps) {
  return (
    <aside className="enhancement-slot" aria-label="Candidate enhancement">
      <span className="eyebrow">Part 2</span>
      <strong>Price movement indicator</strong>
      <p>
        Rows briefly flash green or red when a bid/ask update moves the
        market's mid price, with a matching screen-reader announcement.
      </p>
    </aside>
  );
}

