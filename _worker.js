// Cloudflare Pages Functions worker for the owid-docs project.
//
// When present at the deployment root, this file intercepts ALL requests
// for this Pages project. We use it as a thin router so that one custom
// domain (docs.owid.io) can transparently serve docs from multiple
// source repos:
//
//   /projects/etl/*   →  proxied to https://owid-etl-docs.pages.dev/projects/etl/*
//   everything else   →  served from this project's own static assets
//
// Each subproject keeps its own GitHub repo, its own CI, and its own
// Pages project (per-PR previews on *.pages.dev still work as today).
// Add a new route here whenever another subproject migrates to CF Pages.

const SUBPROJECTS = {
  "/projects/etl/": "https://owid-etl-docs.pages.dev",
  "/projects/owid-grapher-py/": "https://owid-grapher-py-docs.pages.dev",
};

// The legacy COVID docs were never migrated to CF Pages — they stay on
// ReadTheDocs at their native URL. This must be checked BEFORE the
// /en/latest rewrite below: RtD needs the version segment intact.
// NOTE: requires docs.owid.io to be removed as custom domain from the
// RtD project at cut-over, otherwise RtD bounces the native URL back
// here and we loop.
const COVID_PREFIX = "/projects/covid";
const COVID_ORIGIN = "https://owidcovid-19-data.readthedocs.io";

// Legacy ReadTheDocs URLs include an /en/latest segment (e.g.
// /projects/etl/en/latest/, /en/latest/). 301 to the canonical form so
// existing inbound links from blog posts / Slack / bookmarks keep working.
const RTD_LEGACY = /\/en\/latest(\/|$)/;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (
      url.pathname === COVID_PREFIX ||
      url.pathname.startsWith(`${COVID_PREFIX}/`)
    ) {
      const rest = url.pathname.slice(COVID_PREFIX.length);
      return Response.redirect(`${COVID_ORIGIN}${rest}${url.search}`, 301);
    }

    if (RTD_LEGACY.test(url.pathname)) {
      url.pathname = url.pathname.replace(RTD_LEGACY, "$1") || "/";
      return Response.redirect(url.toString(), 301);
    }

    for (const [prefix, origin] of Object.entries(SUBPROJECTS)) {
      // Bare project root without trailing slash (/projects/etl) — redirect
      // to the canonical slash form, otherwise it falls through to the
      // umbrella's static assets and 404s. Deeper slash-less paths don't
      // need this: the proxied Pages project 308s them itself.
      if (url.pathname === prefix.slice(0, -1)) {
        url.pathname = prefix;
        return Response.redirect(url.toString(), 301);
      }
      if (url.pathname.startsWith(prefix)) {
        const target = `${origin}${url.pathname}${url.search}`;
        return fetch(target, request);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
