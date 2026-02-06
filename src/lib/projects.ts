// Dynamically scan /public/projectadd at build time using Vite's import.meta.glob.
// Filename convention: PropertyName_Type_OptionalDetail.ext
//   PropertyName -> card title (replace - / _ with spaces, capitalize words)
//   Type         -> Ongoing | Karaikal | Chennai | Other
//   OptionalDetail -> shown as crimson badge (e.g. "42 Plots")

export type ProjectCategory = "Ongoing" | "Karaikal" | "Chennai" | "Other";

export interface Project {
  name: string;
  category: ProjectCategory;
  detail?: string;
  image: string;
}

const TYPE_MAP: Record<string, ProjectCategory> = {
  ongoing: "Ongoing",
  karaikal: "Karaikal",
  chennai: "Chennai",
  other: "Other",
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
  const [namePart, typePart, ...rest] = parts;
  const cat = TYPE_MAP[typePart.toLowerCase()];
  if (!cat) return null;
  const detail = rest.length ? titleCase(rest.join("_")) : undefined;
  return {
    name: titleCase(namePart),
    category: cat,
    detail,
    image: url,
  };
}

export const projects: Project[] = Object.entries(modules)
  .map(([p, u]) => parseFile(p, u))
  .filter((p): p is Project => !!p);

export const projectsByCategory = (cat: ProjectCategory) =>
  projects.filter((p) => p.category === cat);
