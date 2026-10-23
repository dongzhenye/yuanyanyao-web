# Security dependency upgrade

Approved scope: update the unsupported Next.js 14 installation to Next.js 15.5.28, align its third-party and lint packages, retain React 18.3.1 and the Pages Router, and resolve security findings without unrelated major upgrades. No push, merge, release, preview, or production deployment is authorized.

- [x] Capture frozen-lock baseline, audit, lint and type checks.
- [x] Pin pnpm 10, upgrade framework and compatible vulnerable dependencies; preserve the effective Next.js configuration when consolidating duplicate files.
- [x] Verify lint, strict TypeScript, production build, and local routes/search/filter/history/metadata with third-party requests intercepted.
- [x] Record audit residuals and runtime/deployment requirements, self-review, and commit locally for independent review.

Review focus: drug IDs and missing IDs; Chinese and pinyin search; filters and history; static generation and sitemap; analytics initialization without real telemetry.

References: [Next.js 15 migration](https://nextjs.org/docs/pages/guides/upgrading/version-15), [support policy](https://nextjs.org/support-policy). Registry checked on 2026-10-23: 15.5.28 is latest 15.x. The support page lists 15.x as Maintenance LTS, although its stated two-year policy reaches its boundary on 2026-10-21; this upgrade does not promise ongoing future support.

Implementation decision: retain ESLint 8 with one legacy config (`root: true`) and explicitly select legacy mode for CLI lint, because Next.js 15’s built-in lint rejects legacy options when using ESLint 8 flat config. Keep the build’s lint check enabled. Pin Node 22.23.4, classify next-sitemap as build-only, and retain the two documented build-tool audit findings.
