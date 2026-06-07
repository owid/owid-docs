# OWID Documentation

Umbrella site for OWID's technical documentation.

Production URL: **https://docs.owid.io/** (served from Cloudflare Pages).
`docs-cf.owid.io` remains attached as a staging alias from the parallel-hosting phase.

## What's in this repo

| | |
|---|---|
| `docs/` | Source markdown for the umbrella landing page + links into subprojects |
| `zensical.toml` | Site config (Zensical / Material) |
| `_worker.js` | Cloudflare Pages worker — proxies subproject paths to other Pages projects (`/projects/etl/*`, `/projects/owid-grapher-py/*`, …) |
| `.github/workflows/deploy-docs-cf.yml` | Builds + deploys this site to Cloudflare Pages on every push to `main` |
| `.github/workflows/docs.yml` | Legacy GitHub Pages deploy (to be removed now that the RtD cut-over is done) |
| `.readthedocs.yml` | Legacy RtD build config (to be removed once the cut-over has been stable for a while) |
| `INFRASTRUCTURE.md` | How the CF deployment fits together + how to add a new subproject |

## Local development

```bash
uv sync
uv run zensical serve         # http://localhost:8000
uv run zensical build --clean # output: site/
```

## Deployment

Pushes to `main` deploy to the [`owid-docs`](https://dash.cloudflare.com/?to=/:account/pages/view/owid-docs) Cloudflare Pages project. PRs get per-PR preview URLs at `<branch>.owid-docs.pages.dev`.

For the full picture — adding a new subproject, swapping the custom domain, cache-purge ops — see [`INFRASTRUCTURE.md`](./INFRASTRUCTURE.md).
