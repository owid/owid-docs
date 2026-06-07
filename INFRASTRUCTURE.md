# Documentation infrastructure

This repo is the **umbrella** of OWID's technical documentation. Its content is small (a landing page plus links into the subprojects). What makes it special is that it owns the custom domain and acts as a **router** in front of subproject Pages projects, so one URL transparently serves docs from multiple GitHub repos.

```
                          docs.owid.io  (staging alias: docs-cf.owid.io)
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │  Cloudflare Pages project    │
                  │  owid-docs  (this repo)      │
                  │  ─────────────────────────   │
                  │   _worker.js  (router)       │
                  └──────────────┬───────────────┘
                                 │
              ┌──────────────────┼──────────────────────────┐
              │                  │                          │
              ▼                  ▼                          ▼
  /projects/etl/*    /projects/owid-grapher-py/*     everything else
              │                  │                          │
              ▼                  ▼                          ▼
   owid-etl-docs       owid-grapher-py-docs            this repo's
    .pages.dev              .pages.dev                static assets
   (owid/etl)         (owid/owid-grapher-py)
```

## Repos involved

| Repo | Pages project | Path prefix |
|---|---|---|
| `owid/owid-docs` (this) | `owid-docs` | `/` (umbrella + router) |
| `owid/etl` | `owid-etl-docs` | `/projects/etl/` |
| `owid/owid-grapher-py` | `owid-grapher-py-docs` | `/projects/owid-grapher-py/` |

Each subproject repo owns:
- a `.github/workflows/deploy-docs-cf.yml` that builds the docs and uploads to its Pages project via `wrangler pages deploy`
- a sed-override of `site_url` in CI so the canonical/sitemap URLs reflect the production path on `docs.owid.io/projects/<short>/`

Per-PR previews still work on each project's own `*.pages.dev` URL — the umbrella router is only invoked for traffic to the custom domain.

## `_worker.js` — the router

Lives at repo root, copied into `site/` by the deploy workflow so CF Pages picks it up at the deployment root. When present, it intercepts every request to the Pages project.

Responsibilities, in order:

1. **COVID docs redirect** — `/projects/covid/*` 301s to the legacy COVID docs at their native ReadTheDocs URL (`owidcovid-19-data.readthedocs.io`); they were never migrated to CF Pages. Runs before the `/en/latest` rewrite because RtD needs the version segment intact.
2. **Legacy URL rewrite** — strip the `/en/latest` segment baked into old ReadTheDocs links and 301 to the canonical path.
3. **Subproject routing** — match a `SUBPROJECTS` prefix, `fetch()` the same path on the target Pages project, and stream the response back.
4. **Fallback** — `env.ASSETS.fetch(request)` serves this repo's own static assets (umbrella landing page, CSS, etc.).

To add a new subproject, append one line to the `SUBPROJECTS` map.

## Adding a new subproject

Concrete example: a hypothetical `owid/foo-docs` repo serving its docs at `docs.owid.io/projects/foo/`.

1. **Create the CF Pages project** (use CLI — the dashboard's "Upload static files" flow now creates a Worker, not a Pages project):

   ```bash
   npx wrangler pages project create foo-docs --production-branch=master
   ```

2. **Add a workflow** in `owid/foo` mirroring [`.github/workflows/deploy-docs-cf.yml`](./.github/workflows/deploy-docs-cf.yml) from this repo or from `owid/etl`. Two things to adjust:
   - sed-replace `site_url` to `https://docs.owid.io/projects/foo/`.
   - Stage the build into `staging/projects/foo/` before `wrangler pages deploy`.

3. **Add repo secrets** in `owid/foo`: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID` (same values used by the other repos).

4. **Open a PR on this repo** appending the new prefix to `_worker.js`:

   ```js
   const SUBPROJECTS = {
     "/projects/etl/": "https://owid-etl-docs.pages.dev",
     "/projects/owid-grapher-py/": "https://owid-grapher-py-docs.pages.dev",
     "/projects/foo/": "https://foo-docs.pages.dev",   // new
   };
   ```

5. **Merge order** — `owid/foo` PR first (so the target Pages project gets its first production deploy), then this repo's worker PR. Reverse order is safe but `/projects/foo/*` will 404 in the interim.

## Common operations

### Cache purge (after risky changes)

CF aggressively caches both static assets and worker responses (including 301s). If something looks stale after a deploy:

CF dashboard → **owid.io zone** → Caching → Configuration → Purge Cache → Custom Purge → enter the specific URL(s) → Purge.

### Swapping the custom domain

`docs.owid.io` (plus the staging alias `docs-cf.owid.io`) is bound to the `owid-docs` Pages project. To re-attach to another project (e.g., during emergency rollback), detach from the source first, wait ~30 s, then attach to the target.

### Production branch

Production deploys on a Pages project are only those uploaded with `--branch=<production-branch>`. The production branch is set when creating the project (`--production-branch=master|main`); changing it later via the dashboard requires re-deploying because CF does not auto-promote the latest deploy on the new branch.

### Required repo secrets

Each subproject repo + this one needs:

- `CLOUDFLARE_API_TOKEN` — custom token scoped to `Account › Cloudflare Pages › Edit` + `User › User Details › Read`.
- `CLOUDFLARE_ACCOUNT_ID` — visible in the CF dashboard URL.

One token + account ID pair works for all repos.

## Related deployments (legacy)

- **ReadTheDocs** — no longer serves `https://docs.owid.io/` (DNS was repointed to CF Pages). The RtD projects (`owid-docs`, `owid-etl`, `owid-grapher-py`) can be archived once the cut-over has been stable for a while. The **COVID docs** stay on RtD indefinitely at `https://owidcovid-19-data.readthedocs.io/` — `_worker.js` redirects `/projects/covid/*` there. The `docs.owid.io` custom domain must stay removed from the RtD `owid-docs` project, otherwise RtD redirects the COVID docs' native URL back to `docs.owid.io` and the redirect loops.
- **GitHub Pages** — `.github/workflows/docs.yml` in this repo still publishes a copy. No active consumer; can be removed now that the cut-over is done.
