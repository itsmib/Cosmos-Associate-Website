// Dynamically scan /src/projectadd at build time using Vite's import.meta.glob.
// Filename convention: PropertyName_Type[(Location)][_OptionalDetail].ext
//   PropertyName    -> card title (replace - / _ with spaces, capitalize words)
//   Type            -> Ongoing | Karaikal | Chennai | Other
//   (Location)      -> optional, shown on the card instead of the bare Type.
//                      Useful for "Ongoing" cards so the user sees the city,
//                      e.g. Ruby_Ongoing(Karaikal).jpg -> location "Karaikal".
//                      When omitted, falls back to the Type itself
//                      (e.g. Zume_Karaikal.jpg -> location "Karaikal").
//   OptionalDetail  -> shown as crimson badge (e.g. "42 Plots")

export type ProjectCategory = "Ongoing" | "Karaikal" | "Chennai" | "Renovation" | "Other";

export interface Project {
  name: string;
  category: ProjectCategory;
  location: string;
  detail?: string;
  image: string;
  /** Only set for Renovation projects — distinguishes the two paired images. */
  variant?: "Before" | "After";
}

/** A renovation card pairs a Before and an After image of the same property. */
export interface RenovationProject {
  name: string;
  location: string;
  detail?: string;
  before?: string;
  after?: string;
}

const TYPE_MAP: Record<string, ProjectCategory> = {
  ongoing: "Ongoing",
  karaikal: "Karaikal",
  chennai: "Chennai",
  renovation: "Renovation",
  other: "Other",
};

const RENO_VARIANTS: Record<string, "Before" | "After"> = {
  before: "Before",
  after: "After",
};

function titleCase(raw: string) {
  return raw
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Eagerly import all images placed in public/projectadd via the URL route.
// We use a glob over the public folder via the `?url` import — but Vite's glob
// works on src. For public/, we instead enumerate at runtime is not possible
// without a server. So we rely on a glob over a parallel src/projectadd folder
// AS WELL AS the public path so users can drop images in either.
const modules = import.meta.glob("/src/projectadd/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

function parseFile(path: string, url: string): Project | null {
  const file = path.split("/").pop() || "";
  const base = file.replace(/\.[^.]+$/, "");
  const parts = base.split("_");
  if (parts.length < 2) return null;
  const [namePart, rawTypePart, ...rest] = parts;

  // Extract an optional (Location) suffix from the type part.
  // e.g. "Ongoing(Karaikal)" -> type "Ongoing", location "Karaikal"
  let typeToken = rawTypePart;
  let locationOverride: string | undefined;
  const locMatch = rawTypePart.match(/^([^()]+)\(([^()]+)\)$/);
  if (locMatch) {
    typeToken = locMatch[1];
    locationOverride = locMatch[2];
  }

  const cat = TYPE_MAP[typeToken.toLowerCase()];
  if (!cat) return null;

  // For Renovation, the FIRST trailing token (if it's "Before" or "After")
  // is the variant marker, not part of the badge detail.
  let variant: "Before" | "After" | undefined;
  let detailParts = rest;
  if (cat === "Renovation" && rest.length > 0) {
    const v = RENO_VARIANTS[rest[0].toLowerCase()];
    if (v) {
      variant = v;
      detailParts = rest.slice(1);
    }
  }

  const detail = detailParts.length ? titleCase(detailParts.join("_")) : undefined;

  // Location shown on the card: the override if provided, otherwise the
  // category name (so old-style filenames like "Zume_Karaikal.jpg" keep
  // working without change).
  const location = locationOverride ? titleCase(locationOverride) : cat;

  return {
    name: titleCase(namePart),
    category: cat,
    location,
    detail,
    image: url,
    ...(variant ? { variant } : {}),
  };
}

export const projects: Project[] = Object.entries(modules)
  .map(([p, u]) => parseFile(p, u))
  .filter((p): p is Project => !!p);

export const projectsByCategory = (cat: ProjectCategory) =>
  projects.filter((p) => p.category === cat);

// Group Renovation projects so each property's Before + After images live on
// the same card. Pairing key is "name|location" so two properties of the same
// name in different locations stay distinct.
export const renovationProjects: RenovationProject[] = (() => {
  const map = new Map<string, RenovationProject>();
  for (const p of projects) {
    if (p.category !== "Renovation") continue;
    const key = `${p.name}|${p.location}`;
    let entry = map.get(key);
    if (!entry) {
      entry = { name: p.name, location: p.location, detail: p.detail };
      map.set(key, entry);
    }
    // Prefer the first non-empty detail seen.
    if (!entry.detail && p.detail) entry.detail = p.detail;
    if (p.variant === "Before") entry.before = p.image;
    else if (p.variant === "After") entry.after = p.image;
    else if (!entry.before && !entry.after) entry.after = p.image; // unmarked → treat as single
  }
  return Array.from(map.values());
})();
