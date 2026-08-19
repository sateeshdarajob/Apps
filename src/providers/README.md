# TPM Control Tower — Data Provider Architecture

```
UI / hooks
    ↓
useDataProvider()
    ↓
DataProvider (interface)
    ├─ MockDataProvider   ← current
    └─ JiraDataProvider   ← future (stub only)
```

## Required methods

- `getPrograms()`
- `getIssues()`
- `getDependencies()`
- `getRisks()`
- `getReleases()`
- `getIncidents()`
- `getTeams()`
- `getMetrics()`

Additional Control Tower reads live on the same interface so pages never import mock JSON.

## Switching providers

Set `VITE_DATA_PROVIDER=mock` (default) or `jira` once Jira auth and field mapping exist.

Do **not** implement Jira authentication in this layer yet — `JiraDataProvider` throws until that work lands.
