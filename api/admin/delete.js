// POST /api/admin/delete
// Body JSON: { filename: string }
// Deletes src/projectadd/<filename> from GitHub.

import axios from 'axios';
import { env, requireAuth, ghHeaders, ghContentsUrl } from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAuth(req, res)) return;

  const { GITHUB_BRANCH } = env();
  const { filename } = req.body || {};

  if (!filename) {
    return res.status(400).json({ error: 'filename is required.' });
  }
  if (filename.includes('/') || filename.includes('..')) {
    return res.status(400).json({ error: 'Filename must be a plain filename.' });
  }

  try {
    // GitHub requires the sha when deleting — fetch it first.
    let sha;
    try {
      const existing = await axios.get(ghContentsUrl(filename), {
        headers: ghHeaders(),
        params: { ref: GITHUB_BRANCH },
      });
      sha = existing.data.sha;
    } catch (e) {
      if (e?.response?.status === 404) {
        return res.status(404).json({ error: 'File not found.' });
      }
      throw e;
    }

    await axios.delete(ghContentsUrl(filename), {
      headers: ghHeaders(),
      data: {
        message: `Remove project image: ${filename}`,
        sha,
        branch: GITHUB_BRANCH,
      },
    });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    return res.status(500).json({ error: 'Delete failed.' });
  }
}
