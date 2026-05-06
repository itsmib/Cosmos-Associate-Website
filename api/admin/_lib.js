// Shared helpers for admin endpoints.
//
// Auth model: a single ADMIN_PASSWORD env var. The client sends it as an
// `x-admin-password` header on every request. Constant-time compare so we
// don't leak length via timing. Not a replacement for real auth — this is
// a single-user tool. Put it behind a strong random password.

import crypto from 'crypto';

const GITHUB_TOKEN   = process.env.GITHUB_TOKEN;
const GITHUB_OWNER   = process.env.GITHUB_OWNER;
const GITHUB_REPO    = process.env.GITHUB_REPO;
const GITHUB_BRANCH  = process.env.GITHUB_BRANCH || 'main';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const GH_CONTENTS_PATH = 'src/projectadd';
export const VALID_EXTS  = ['jpg', 'jpeg', 'png', 'webp'];
const VALID_TYPES        = ['ongoing', 'karaikal', 'renovation', 'plotlayout', 'other'];
const RENO_VARIANTS      = ['before', 'after'];
export const MAX_BYTES   = 5 * 1024 * 1024;

export function env() {
  return { GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO, GITHUB_BRANCH, GH_CONTENTS_PATH };
}

// Returns true iff the request provides a password matching ADMIN_PASSWORD.
// Responds 401 + logs nothing if not — do NOT echo back what was submitted.
export function requireAuth(req, res) {
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: 'ADMIN_PASSWORD not configured on the server.' });
    return false;
  }
  const supplied = req.headers['x-admin-password'] || '';
  const a = Buffer.from(String(supplied));
  const b = Buffer.from(String(ADMIN_PASSWORD));
  const ok = a.length === b.length && crypto.timingSafeEqual(a, b);
  if (!ok) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }
  return true;
}

export function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'cosmos-admin',
  };
}

export function ghContentsUrl(filename) {
  const safe = encodeURIComponent(filename);
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GH_CONTENTS_PATH}/${safe}`;
}

export function ghDirUrl() {
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GH_CONTENTS_PATH}`;
}

// Filename parser — mirrors src/lib/projects.ts so the admin UI can show
// what the user is about to commit (same breakdown the site will render).
export function parseFilename(filename) {
  const base = filename.replace(/\.[^/.]+$/, '');
  const parts = base.split('_');
  if (parts.length < 2) return null;

  const [namePart, rawTypePart, ...rest] = parts;
  let typeToken = rawTypePart;
  let locationOverride;
  const locMatch = rawTypePart.match(/^([^()]+)\(([^()]+)\)$/);
  if (locMatch) {
    typeToken = locMatch[1];
    locationOverride = locMatch[2];
  }
  const typeLc = typeToken.toLowerCase();
  if (!VALID_TYPES.includes(typeLc)) return null;

  const categoryLabel = typeToken.charAt(0).toUpperCase() + typeLc.slice(1);
  const location = titleCase(locationOverride || categoryLabel);

  // Renovation files may carry a Before/After variant as the first trailing
  // token, e.g. "SiddiqueHouse_Renovation_Before.jpg".
  let variant;
  let detailParts = rest;
  if (typeLc === 'renovation' && rest.length > 0 && RENO_VARIANTS.includes(rest[0].toLowerCase())) {
    variant = rest[0].charAt(0).toUpperCase() + rest[0].slice(1).toLowerCase();
    detailParts = rest.slice(1);
  }
  const detail = detailParts.length ? titleCase(detailParts.join('_')) : undefined;
  const name = titleCase(namePart);
  return { name, categoryLabel, location, detail, ...(variant ? { variant } : {}) };
}

function titleCase(raw) {
  return raw
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

export function validExt(filename) {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  return VALID_EXTS.includes(ext);
}
