# Solution Steps

1. Update the data hook to create a fresh AbortController inside each effect run and pass its signal into both existing service calls. Abort that controller in the cleanup function so in-flight requests are cancelled when filters change or the page unmounts.

2. Protect against stale overwrites by tracking a monotonically increasing request id in a ref. Before writing any async result into state, confirm that the resolving request id is still the latest one and that the signal was not aborted.

3. Treat AbortError as a non-error path. Ignore it in catch/finally blocks so aborted requests do not show inline errors and do not attempt state updates after unmount.

4. Preserve previously loaded data on API failures. On non-abort errors, set the error message but do not clear orders, totalCount, or summary, so the table keeps the last successful results visible.

5. Keep the hook dependencies tied to the actual filter primitives (query, status, page) plus failure mode. This avoids accidental refetches caused only by object identity changes.

6. Memoize the derived filters object in the page with useMemo so the page has a stable representation of the current fetch parameters.

7. Stabilize row-selection and filter-change handlers with useCallback. This prevents a brand-new function reference from being passed to every row on each render.

8. Wrap OrderRow with React.memo so a row only re-renders when its own order data, selection state, or callback reference changes. With a stable onSelectRow callback, only rows whose props changed will update.

9. Leave the service layer behavior intact except for supplying AbortSignal from the hook, satisfying the constraint not to refactor the API helpers themselves.

