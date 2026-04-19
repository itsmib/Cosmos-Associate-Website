// GET /api/admin/list
// Returns all project images in src/projectadd with parsed metadata.

import axios from 'axios';
import { env, requireAuth, ghHeaders, ghDirUrl, parseFilename } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAuth(req, res)) return;

  const { GITHUB_BRANCH } = env();

  try {
    const r = await axios.get(ghDirUrl(), {
      headers: ghHeaders(),
      params: { ref: GITHUB_BRANCH },
    });
    const entries = Array.isArray(r.data) ? r.data : [];
    const files = entries
      .filter(e => e.type === 'file')
      .map(e => {
        const parsed = parseFilename(e.name);
        return {
          filename: e.name,
          sha: e.sha,
          size: e.size,
          // download_url is served by GitHub with a short-lived signed URL;
          // fine to use for admin thumbnails but don't cache.
          url: e.download_url,
          parsed,
        };
      })
      .sort((a, b) => a.filename.localeCompare(b.filename));
    return res.status(200).json({ files });
  } catch (e) {
    if (e?.response?.status === 404) {
      return res.status(200).json({ files: [] });
    }
    console.error(e?.response?.data || e.message);
    return res.status(500).json({ error: 'Failed to list projects.' });
  }
}
