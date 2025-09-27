export default {
  async scheduled(event, env, ctx) {
    const baseUrl = 'http://103.161.119.206:25087';
    const endpoints = {
      health: '/api/health',
      leaderboards: '/api/leaderboards',
      players: '/api/players',
      skills: '/api/skills',
    };

    await Promise.all(
      Object.entries(endpoints).map(async ([key, path]) => {
        const url = baseUrl + path;
        try {
          const res = await fetch(url, { headers: { 'Content-Type': 'application/json' } });
          if (!res.ok) throw new Error(`HTTP ${res.status} from ${url}`);
          const data = await res.json();
          const jsonStr = JSON.stringify(data, null, 2);

          // Persist to KV if available
          if (env.DATA) {
            await env.DATA.put(`${key}.json`, jsonStr);
          }

          // Commit back to GitHub if secrets are provided
          const token  = env.GITHUB_TOKEN;
          const owner  = env.REPO_OWNER;
          const repo   = env.REPO_NAME;
          const branch = env.REPO_BRANCH || 'main';
          if (token && owner && repo) {
            const filePath = `${key}.json`;
            const toBase64 = (str) => btoa(unescape(encodeURIComponent(str)));

            let existingSha;
            try {
              const getRes = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`,
                {
                  headers: {
                    Authorization: `token ${token}`,
                    Accept: 'application/vnd.github.v3+json',
                  },
                },
              );
              if (getRes.ok) {
                const fileData = await getRes.json();
                existingSha = fileData.sha;
              }
            } catch {
              /* ignore 404 */
            }

            const payload = {
              message: `chore: update ${filePath} from Cloudflare Worker`,
              content: toBase64(jsonStr),
              branch,
              ...(existingSha ? { sha: existingSha } : {}),
            };

            await fetch(
              `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
              {
                method: 'PUT',
                headers: {
                  Authorization: `token ${token}`,
                  'Content-Type': 'application/json',
                  Accept: 'application/vnd.github.v3+json',
                },
                body: JSON.stringify(payload),
              },
            );
          }

          console.log(`Processed ${key}.json (${jsonStr.length} chars)`);
        } catch (err) {
          console.error(`Error fetching ${key}:`, err);
        }
      }),
    );
  },

  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.replace(/^\//, '');
    if (!key) return new Response('OK', { status: 200 });
    try {
      const value = await env.DATA.get(`${key}.json`);
      if (!value) return new Response('Not found', { status: 404 });
      return new Response(value, { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch {
      return new Response('Error retrieving data', { status: 500 });
    }
  },
};
