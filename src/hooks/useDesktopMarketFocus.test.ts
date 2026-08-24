import { renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useDesktopMarketFocus } from './useDesktopMarketFocus';

function createFakeBridge() {
  const listeners = new Set<(marketId: string) => void>();
  return {
    host: 'electron' as const,
    onMarketFocus: vi.fn((listener: (marketId: string) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    }),
    emit(marketId: string) {
      listeners.forEach((listener) => listener(marketId));
    },
    listenerCount() {
      return listeners.size;
    },
  };
}

describe('useDesktopMarketFocus', () => {
  afterEach(() => {
    delete (window as { marketDesktop?: unknown }).marketDesktop;
  });

  it('subscribes once and unsubscribes on unmount', () => {
    const bridge = createFakeBridge();
    window.marketDesktop = bridge;

    const onFocus = vi.fn();
    const { rerender, unmount } = renderHook(
      ({ callback }) => useDesktopMarketFocus(callback),
      { initialProps: { callback: onFocus } }
    );

    expect(bridge.onMarketFocus).toHaveBeenCalledTimes(1);
    expect(bridge.listenerCount()).toBe(1);

    rerender({ callback: onFocus });
    expect(bridge.onMarketFocus).toHaveBeenCalledTimes(1);

    unmount();
    expect(bridge.listenerCount()).toBe(0);
  });

  it('always invokes the latest callback, not a stale one', () => {
    const bridge = createFakeBridge();
    window.marketDesktop = bridge;

    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(
      ({ callback }) => useDesktopMarketFocus(callback),
      { initialProps: { callback: firstCallback } }
    );

    rerender({ callback: secondCallback });

    bridge.emit('pac-market');

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledWith('pac-market');
  });
});
