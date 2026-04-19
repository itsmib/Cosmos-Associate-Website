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
Name_Category[(Location)][_Detail].ext
```

- **Name**: property name (use `_` or `-` for spaces)
- **Category**: `Ongoing`, `Karaikal`, `Chennai`, or `Other` — determines which section the card appears in
- **Location** (optional, in parentheses): what's shown on the card next to the map pin. Useful for `Ongoing` cards so viewers see the city instead of the word "Ongoing". Defaults to the category name if omitted.
- **Detail** (optional): shown as a crimson badge (e.g. `42Plots`)

Examples:
- `Ruby_Ongoing(Karaikal).jpg` → Ongoing section, card shows "Karaikal"
- `Ruby_Ongoing(Karaikal)_42Plots.jpg` → Ongoing section, "Karaikal" + "42 Plots" badge
- `Zume_Karaikal.jpg` → Karaikal section, card shows "Karaikal"
- `Zume_Karaikal_42Plots.jpg` → Karaikal section, "Karaikal" + "42 Plots" badge

## Admin panel

The site ships with a password-protected admin page at **`/admin.html`** that lets you list, upload, and delete project images from any browser (no Telegram / git push needed).

Required env vars (set in Vercel → Project → Settings → Environment Variables):

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | Fine-grained PAT with `Contents: read/write` on this repo |
| `GITHUB_OWNER` | Repo owner (e.g. `noorul-misbah`) |
| `GITHUB_REPO` | This repo name |
| `GITHUB_BRANCH` | Usually `main` (optional, defaults to `main`) |
| `ADMIN_PASSWORD` | Any long random string — this is what you'll type to log in |

After deploy, visit `https://<your-domain>/admin.html`.
