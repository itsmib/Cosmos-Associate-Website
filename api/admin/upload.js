// POST /api/admin/upload
// Body JSON: { filename: string, contentBase64: string }
// Adds or updates src/projectadd/<filename> on GitHub.

import axios from 'axios';
import {
  env,
  requireAuth,
  ghHeaders,
  ghContentsUrl,
  parseFilename,
  validExt,
  MAX_BYTES,
} from './_lib.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!requireAuth(req, res)) return;

  const { GITHUB_BRANCH } = env();
  const { filename, contentBase64 } = req.body || {};

  if (!filename || !contentBase64) {
    return res.status(400).json({ error: 'filename and contentBase64 are required.' });
  }
  if (filename.includes('/') || filename.includes('..')) {
    return res.status(400).json({ error: 'Filename must be a plain filename.' });
  }
  if (!validExt(filename)) {
    return res.status(400).json({ error: 'Unsupported extension. Use .jpg, .jpeg, .png or .webp.' });
  }
  if (!parseFilename(filename)) {
    return res.status(400).json({
      error: 'Invalid filename. Use Name_Category(Location)_Detail.jpg — category must be Ongoing, Karaikal, Renovation, PlotLayout, or Other. For Renovation, add _Before or _After before the badge: Name_Renovation_Before.jpg.',
    });
  }

  // Size check on the decoded bytes. base64 length * 3/4 ≈ byte size.
  const approxBytes = Math.floor((contentBase64.length * 3) / 4);
  if (approxBytes > MAX_BYTES) {
    return res.status(400).json({
      error: `File too large (${(approxBytes / 1024 / 1024).toFixed(1)} MB). Max ${MAX_BYTES / 1024 / 1024} MB.`,
    });
  }

  try {
    // Check for existing file so we can overwrite rather than error.
    let sha;
    try {
      const existing = await axios.get(ghContentsUrl(filename), {
        headers: ghHeaders(),
        params: { ref: GITHUB_BRANCH },
      });
      sha = existing.data.sha;
    } catch (e) {
      if (e?.response?.status !== 404) throw e;
    }

    await axios.put(
      ghContentsUrl(filename),
      {
        message: `${sha ? 'Update' : 'Add'} project image: ${filename}`,
        content: contentBase64,
        branch: GITHUB_BRANCH,
        ...(sha && { sha }),
      },
      { headers: ghHeaders() }
    );

    return res.status(200).json({ ok: true, updated: Boolean(sha) });
  } catch (e) {
    console.error(e?.response?.data || e.message);
    return res.status(500).json({ error: 'Upload failed.' });
  }
}

// Vercel's default body limit for JSON is ~4.5 MB; bump it so base64 payloads
// up to 5 MB of raw binary (~6.7 MB of base64) fit.
export const config = {
  api: {
    bodyParser: { sizeLimit: '8mb' },
  },
};
