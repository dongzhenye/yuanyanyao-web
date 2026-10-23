# Security upgrade validation

## Scope and baseline

Base: `b620dd37609e79f9b82950fe45e3359085c54659` (`origin/main`, fetched 2026-10-23). Work is isolated on `codex/security-upgrade`. Deployment remains subject to explicit user approval.

The frozen pnpm lockfile installed successfully. Baseline TypeScript passed; baseline `next lint` failed because the legacy ESLint configuration walked into the primary checkout and could not resolve `next/core-web-vitals`. Runtime configuration loading confirmed `next.config.js`, strict mode, and `raw.githubusercontent.com` image access; the unused TypeScript config was removed. No drug data or search algorithm changes are intended.

Baseline pnpm audit reported 80 findings (3 critical, 47 high, 25 moderate, 5 low); this is dependency-path accounting, not the same count as GitHub Dependabot alerts.

## Decisions

Next.js, `@next/third-parties`, and `eslint-config-next` are pinned together at 15.5.28. React and React DOM stay at 18.3.1 because this is a Pages Router application. The package manager is pinned to pnpm 10.30.3, which supports the existing lockfile format. Validation uses Node 22.23.4, pinned in `.nvmrc`; `engines.node` limits deployment to Node 22.

`next>postcss` is overridden to 8.5.31 within PostCSS's current major because Next.js still pins vulnerable 8.4.31. The standalone ESLint command explicitly selects legacy mode to avoid picking up an ancestor flat config. It and Next.js build use one legacy `.eslintrc.json` with `root: true`. Next.js 15 built-in lint passes legacy options to ESLint 8 FlatESLint, which rejects them; keeping the already-installed ESLint major with a legacy configuration avoids that incompatibility. `outputFileTracingRoot` explicitly selects this repository rather than the ancestor checkout.

## Reproduction

```sh
pnpm install --frozen-lockfile
pnpm check-all
pnpm start --hostname 127.0.0.1 --port 3103
# In another terminal:
pnpm test:smoke
pnpm audit
pnpm audit --prod
```

The route smoke runner refuses a non-local target. Browser validation must intercept all non-local requests, including Google Analytics; no live analytics hits or advertising impressions are needed. This codebase currently contains Google Analytics and no advertising integration.

## Deployment boundary

No push, merge, tag, release, Vercel preview, or production deployment is included. Before an authorized deployment, use Node 22 and the pinned pnpm version, run a frozen install and production build, confirm the target project and generated sitemap origin, then repeat public route and search checks. The support page currently lists Next.js 15 as Maintenance LTS, while its two-year policy has reached the date boundary; moving to 16 can be planned separately rather than treating 15 as a long-term guarantee.

## Security residuals

Full audit after compatible patches: **2 findings: 1 high, 1 moderate**, with no critical findings. `minimatch@9.0.3` and `yaml@2.7.0` receive scoped overrides to 9.0.7 and 2.8.3 respectively. Build-only `next-sitemap` is classified as a development dependency; production builds must install development dependencies.

- [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): `braces@3.0.3`, high, no published fix in the audit response. Reached by lint/build file globbing and sitemap generation, not a request handler. Do not process untrusted glob patterns with these tools.
- [GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf): Tailwind 3 uses `postcss-selector-parser@6.1.5`; the fix starts at 7.1.6. It parses trusted repository styles during builds. A forced cross-major replacement was not used in this focused framework upgrade.

Production audit reports **zero findings** across 64 dependencies, including Next.js’s resolved `sharp@0.35.5`. These are remaining findings, not suppressions. `pnpm audit` therefore intentionally exits nonzero. Native optional binaries work without enabling the ignored `unrs-resolver` postinstall script on this validation host.


## Verified results

- `pnpm install --frozen-lockfile`: passed.
- `pnpm check-all`: passed, including standalone lint, strict TypeScript, built-in build lint, 17 static pages, and sitemap generation. No lint suppression or type-check suppression was added.
- `pnpm test:smoke` against the production server on `127.0.0.1:3103`: passed for home, about, API, missing-drug 404, all 13 drug detail pages and their SEO metadata/sitemap entries, and robots.txt.
- Isolated Chromium at 390×844: Chinese `布洛芬` and pinyin `buluofen` each returned two drugs; the foreign-registration filter returned zero, the domestic filter restored two; related search and history restore returned to `buluofen`. No horizontal overflow at 390 or 1440 pixels, and no uncaught page errors.
- Google Analytics config and search events were present in the local dataLayer; all non-local browser requests were fulfilled locally with empty responses. The only attempted external host was `www.googletagmanager.com`.
- No application code or drug data changed. Generated sitemap timestamps were verified then restored to avoid committing build-time churn.

Self-review checked effective configuration parity, patched dependency paths, Pages Router compatibility, unchanged data, build inclusion of lint/type checks, and local-only test scope. Independent review is performed by the parent task before any deployment decision.
