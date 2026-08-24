import { useEffect, useState } from 'react';
import type { Desk, MarketQuote } from '../types';
import { desktopBridgeMock } from '../lib/desktopBridgeMock';
import { marketFeed } from '../lib/marketFeed';

interface ShellDiagnosticsProps {
  desk: Desk;
  quotes: MarketQuote[];
  mounted: boolean;
  onMountedChange: (mounted: boolean) => void;
}

export function ShellDiagnostics({
  desk,
  quotes,
  mounted,
  onMountedChange,
}: ShellDiagnosticsProps) {
  const [, forceRefresh] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => forceRefresh((n) => n + 1), 200);
    return () => window.clearInterval(interval);
  }, []);

  const lastQuote = quotes.at(-1);

  return (
    <section className="diagnostics" aria-label="Integration test controls">
      <div className="diagnostic-panel" aria-label="Electron">
        <div>
          <span className="eyebrow">Electron</span>
          <p>
            Active listeners{' '}
            <strong>{desktopBridgeMock.activeListenerCount()}</strong>
            <span aria-hidden="true"> · </span>
            Registrations{' '}
            <strong>{desktopBridgeMock.registrationCount()}</strong>
          </p>
        </div>
        <div className="diagnostic-actions">
          <button
            className="button button--quiet"
            type="button"
            disabled={!mounted || !lastQuote}
            onClick={() =>
              lastQuote && desktopBridgeMock.focusMarket(lastQuote.id)
            }
          >
            Focus last market
          </button>
          <button
            className="button button--quiet"
            type="button"
            onClick={() => onMountedChange(!mounted)}
          >
            {mounted ? 'Unmount renderer' : 'Mount renderer'}
          </button>
        </div>
      </div>
      <div className="diagnostic-panel" aria-label="External Data API">
        <div>
          <span className="eyebrow">External Data API</span>
          <p>
            Visible markets <strong>{quotes.length}</strong>
            <span aria-hidden="true"> · </span>
            Desk <strong>{desk}</strong>
          </p>
        </div>
        <div className="diagnostic-actions">
          <button
            className="button button--quiet"
            type="button"
            disabled={!mounted}
            onClick={() => marketFeed.simulateBurst(desk)}
          >
            Send update burst
          </button>
        </div>
      </div>
    </section>
  );
}
