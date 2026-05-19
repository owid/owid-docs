// Cloudflare Pages Functions worker for the owid-docs project.
//
// When present at the deployment root, this file intercepts ALL requests
// for this Pages project. We use it as a thin router so that one custom
// domain (docs-cf.owid.io and later docs.owid.io) can transparently serve
// docs from multiple source repos:
//
//   /projects/etl/*   →  proxied to https://owid-etl-docs.pages.dev/projects/etl/*
//   everything else   →  served from this project's own static assets
//
// Each subproject keeps its own GitHub repo, its own CI, and its own
// Pages project (per-PR previews on *.pages.dev still work as today).
// Add a new route here whenever another subproject migrates to CF Pages.

const SUBPROJECTS = {
  "/projects/etl/": "https://owid-etl-docs.pages.dev",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    for (const [prefix, origin] of Object.entries(SUBPROJECTS)) {
      if (url.pathname.startsWith(prefix)) {
        const target = `${origin}${url.pathname}${url.search}`;
        return fetch(target, request);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
