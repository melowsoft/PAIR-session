# DECISION_LOG.md

Decision Log:

**Mins coercion:**\
No coercion occurs. The mins field remains as a string ("8", "14")
throughout the app. This is intentional --- we only display it
(`{session.mins} min`), never perform arithmetic, so string is
appropriate and avoids unnecessary type conversions.

**Debounce implementation:**\
Used a custom `useDebounce` hook with a `setTimeout/clearTimeout`
pattern. This approach isolates timing logic, prevents callback hell in
components, and allows reuse across the app. The 300ms delay balances
responsiveness with performance.

**Stable sorting:**\
When sessions share the same popularity, `a.id.localeCompare(b.id)`
guarantees deterministic ordering. Session IDs (`s1`, `s2`, etc.)
provide a natural, consistent tie‑breaker unaffected by JavaScript's
unstable sort implementations.

**Toggle accessibility:**\
The completion toggle uses `aria-pressed` with a dynamic `aria-label`
that announces the action (`Mark "${title}" as complete/incomplete"`).
It supports both keyboard (Space/Enter via browser defaults) and mouse,
with clear visual states (color changes, icon updates, "Done!" badge)
and semantic text labels.
