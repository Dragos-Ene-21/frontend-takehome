# Submission notes

## What I changed

**1A — Desk subscriptions:** the feed effect had an empty dependency array, so
switching desks never unsubscribed the old feed or loaded fresh data. It also
read stale state when applying updates, so two updates in a row could
overwrite each other. Fixed by depending on `[desk]` and using the functional
`setQuotes(prev => ...)` form.

**1B — Delayed sort:** the sort dropdown didn't do anything until some other
change happened to trigger a re-render, because `sortMode` was missing from
the `useMemo` dependency array. Added it.

**1C — Render isolation:** wrapped `MarketTable` and `MarketRow` in
`React.memo`, and stopped creating a new inline function per row on every
render (that alone was breaking memoization). Combined with the 1A fix,
unrelated re-renders (the clock) no longer touch any row, and a quote update
or selection only re-renders the row(s) actually affected.

**3A — Listener lifecycle:** the desktop focus hook subscribed but never
called the unsubscribe function it got back, so the listener leaked past
unmount. Fixed by returning it from the effect. Also noticed the diagnostics
panel read the listener counts as plain values during render, so it didn't
refresh after an unmount — added a small interval to keep that display
accurate.

**3B — Stale state:** the subscription effect only runs once (on purpose, for
3A), but it captured whatever callback existed on the very first render — so
it kept checking against the initial Atlantic markets forever. Fixed with a
ref that always holds the latest callback, so the subscription stays stable
but always sees current state.

## Product improvement

Rows briefly flash green or red when a price update moves the market up or
down. Makes it easier to spot which row just changed on a fast-moving list
without eyeballing every number.

## Electron boundary

React never touches Electron or Node directly — it only calls
`window.marketDesktop`, a small typed API from the preload script (or the
mock, in the browser). That keeps the renderer sandboxed like a normal web
page while still getting the one thing it needs.

The listener subscribes once per mount, so nothing else (desk switching,
search, sort, selection) causes it to resubscribe. It always reacts to
current state by reading the latest callback from a ref instead of closing
over old state. On unmount, it calls the bridge's own unsubscribe function,
so the listener count drops right away instead of leaking.

## With more time

- **3C (web fallback)** — skipped due to time. Right now the hook calls
  `window.marketDesktop!.onMarketFocus(...)`, which throws if the bridge
  isn't there. Fix would be a guard: if `window.marketDesktop` is
  missing, skip subscribing entirely and leave everything else (feed,
  search, sort, external data panel) working as normal.
- Would add tests for the 1A burst-update fix and the 1B sort fix with more
  time.
