# Cosmos Associates & Builders — Website

Marketing site for Cosmos Associates & Builders, Karaikal's trusted real estate builder since 1985.

## Stack

- Vite + React + TypeScript
- Tailwind CSS + shadcn/ui
- Vitest for tests

## Scripts

- `bun dev` / `npm run dev` — start dev server on port 8080
- `bun run build` — production build
- `bun test` — run tests

## Adding projects

Drop a project image into `src/projectadd/` using the naming convention:

```
Name_Category[_Detail].ext
```

- **Name**: property name (use `_` or `-` for spaces)
- **Category**: `Ongoing`, `Karaikal`, `Chennai`, or `Other`
- **Detail** (optional): shown as a crimson badge (e.g. `42Plots`)

Example: `Zume_Karaikal_42Plots.jpg` → appears in the Karaikal section with a "42 Plots" badge.
