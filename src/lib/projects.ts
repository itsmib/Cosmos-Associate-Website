// Folder-per-project loader.
//
// Each project lives in its own folder under src/projectadd/<slug>/:
//   <slug>/
//     <slug>.md       (or any *.md) — YAML frontmatter + markdown body
//     cover.<ext>     — shown on the homepage card (REQUIRED for non-Renovation)
//     gallery-*.<ext> — extra images shown on the detail page (optional)
//     before.<ext>    — Renovation only: paired "Before" image
//     after.<ext>     — Renovation only: paired "After" image
//
// The folder name on disk IS the slug — no re-slugification. The display name
// comes from frontmatter so the URL and the heading can be styled independently.

import yaml from "js-yaml";

// Tiny frontmatter splitter — gray-matter pulls in eval and a CJS-shimmed
// js-yaml that misbehaves under Vite, so we do the split ourselves.
function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const m = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, content: raw };
  let data: Record<string, unknown> = {};
  try {
    const parsed = yaml.load(m[1]);
    if (parsed && typeof parsed === "object") data = parsed as Record<string, unknown>;
  } catch (err) {
    console.warn("[projects] frontmatter YAML parse failed:", err);
  }
  return { data, content: m[2] || "" };
}

export type ProjectCategory =
  | "Ongoing"
  | "Karaikal"
  | "Renovation"
  | "PlotLayout"
  | "Other";

export interface Project {
  slug: string;
  name: string;
  category: ProjectCategory;
  location: string;
  badge?: string;
  cover: string;
  gallery: string[];
  before?: string;
  after?: string;
  // Frontmatter-driven detail fields. All optional — the detail page must
  // render gracefully when most/all of these are missing.
  description?: string;
  price?: string;
  yearStarted?: string | number;
  yearCompleted?: string | number;
  plots?: string | number;
  areaSqft?: string;
  amenities?: string[];
  mapLink?: string;
}

const CATEGORY_MAP: Record<string, ProjectCategory> = {
  ongoing: "Ongoing",
  karaikal: "Karaikal",
  renovation: "Renovation",
  plotlayout: "PlotLayout",
  "plot-layout": "PlotLayout",
  "plot_layout": "PlotLayout",
  plot: "PlotLayout",
  plots: "PlotLayout",
  available: "PlotLayout",
  "available-plots": "PlotLayout",
  other: "Other",
};

// Eager glob — both markdown bodies and image URLs are baked into the bundle
// at build time. The patterns must be string literals for Vite to statically
// analyse them. Both patterns recurse exactly one folder level deep.
const markdownModules = import.meta.glob(
  "/src/projectadd/*/*.md",
  { eager: true, query: "?raw", import: "default" }
) as Record<string, string>;

const imageModules = import.meta.glob(
  "/src/projectadd/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}",
  { eager: true, import: "default" }
) as Record<string, string>;

interface FolderBuckets {
  markdown?: { path: string; raw: string };
  cover?: string;
  before?: string;
  after?: string;
  gallery: { name: string; url: string }[];
}

function slugFromPath(path: string): string | null {
  // Path is always "/src/projectadd/<slug>/<file>" — the slug is segment 3.
  const m = path.match(/^\/src\/projectadd\/([^/]+)\/[^/]+$/);
  return m ? m[1] : null;
}

function fileNameFromPath(path: string): string {
  return path.substring(path.lastIndexOf("/") + 1);
}

const folders = new Map<string, FolderBuckets>();

function bucket(slug: string): FolderBuckets {
  let b = folders.get(slug);
  if (!b) {
    b = { gallery: [] };
    folders.set(slug, b);
  }
  return b;
}

for (const [path, raw] of Object.entries(markdownModules)) {
  const slug = slugFromPath(path);
  if (!slug) continue;
  bucket(slug).markdown = { path, raw };
}

for (const [path, url] of Object.entries(imageModules)) {
  const slug = slugFromPath(path);
  if (!slug) continue;
  const file = fileNameFromPath(path).toLowerCase();
  const b = bucket(slug);
  if (/^cover\.(jpg|jpeg|png|webp)$/i.test(file)) {
    b.cover = url;
  } else if (/^before\.(jpg|jpeg|png|webp)$/i.test(file)) {
    b.before = url;
  } else if (/^after\.(jpg|jpeg|png|webp)$/i.test(file)) {
    b.after = url;
  } else {
    b.gallery.push({ name: file, url });
  }
}

function normaliseCategory(raw: unknown): ProjectCategory | null {
  if (typeof raw !== "string") return null;
  return CATEGORY_MAP[raw.trim().toLowerCase()] ?? null;
}

function asString(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  const s = String(v).trim();
  return s.length > 0 ? s : undefined;
}

function asStringList(v: unknown): string[] | undefined {
  if (Array.isArray(v)) {
    const items = v.map((x) => String(x).trim()).filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  if (typeof v === "string") {
    const items = v.split(",").map((x) => x.trim()).filter(Boolean);
    return items.length > 0 ? items : undefined;
  }
  return undefined;
}

function buildProject(slug: string, b: FolderBuckets): Project | null {
  // Skip folders with no markdown — treat them as in-progress drafts rather
  // than crash the whole site.
  if (!b.markdown) return null;

  const parsed = parseFrontmatter(b.markdown.raw);
  const fm = parsed.data;

  const category = normaliseCategory(fm.category);
  if (!category) {
    console.warn(`[projects] ${slug}: missing/invalid category`);
    return null;
  }

  const name = asString(fm.name) ?? slug;
  const location = asString(fm.location) ?? category;

  // Cover resolution: explicit `cover.*`, else for Renovation fall back to
  // before-or-after, else first gallery image alphabetically. Without ANY
  // image we still emit the project — the card will render a tinted placeholder.
  const sortedGallery = b.gallery.sort((a, z) => a.name.localeCompare(z.name));
  const cover =
    b.cover ??
    (category === "Renovation" ? b.before ?? b.after : undefined) ??
    sortedGallery[0]?.url ??
    "";

  // For Renovation, before/after are part of the hero — exclude them from
  // the gallery. For everything else they shouldn't exist; if they do, treat
  // them as gallery images.
  const galleryUrls =
    category === "Renovation"
      ? sortedGallery.map((g) => g.url)
      : sortedGallery.map((g) => g.url);

  return {
    slug,
    name,
    category,
    location,
    badge: asString(fm.badge),
    cover,
    gallery: galleryUrls,
    before: b.before,
    after: b.after,
    description: parsed.content?.trim() || undefined,
    price: asString(fm.price),
    yearStarted: asString(fm.yearStarted) ?? (typeof fm.yearStarted === "number" ? fm.yearStarted : undefined),
    yearCompleted: asString(fm.yearCompleted) ?? (typeof fm.yearCompleted === "number" ? fm.yearCompleted : undefined),
    plots: asString(fm.plots) ?? (typeof fm.plots === "number" ? fm.plots : undefined),
    areaSqft: asString(fm.areaSqft),
    amenities: asStringList(fm.amenities),
    mapLink: asString(fm.mapLink) ?? asString(fm.mapQuery),
  };
}

export const projects: Project[] = Array.from(folders.entries())
  .map(([slug, b]) => buildProject(slug, b))
  .filter((p): p is Project => p !== null)
  .sort((a, z) => a.name.localeCompare(z.name));

export const projectsByCategory = (cat: ProjectCategory) =>
  projects.filter((p) => p.category === cat);

export const projectBySlug = (slug: string) =>
  projects.find((p) => p.slug === slug);
