# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an open-source Chinese pharmaceutical drug directory website (原研药目录网站) built with Next.js. It provides a searchable interface for original/innovator drugs (原研药) based on the yuanyanyao database.

## Development Commands

### Essential Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (runs type-check first)
- `pnpm lint` - Run ESLint
- `pnpm type-check` - TypeScript type checking only
- `pnpm check-all` - Run all checks (type-check → lint → build) - **Use this before committing**

### Working with the Codebase

- Package manager: **pnpm** (not npm or yarn)
- Always run `pnpm check-all` before pushing changes
- TypeScript is configured with very strict settings - all code must pass type checking
- The build process automatically generates sitemap after completion

## Architecture Overview

### Data Flow

1. **Static Drug Data**: All drug information is stored in `src/data/drugs.json`
2. **Search Implementation**: Uses Fuse.js for fuzzy search with pinyin support (see `src/lib/search.ts`)
3. **Static Generation**: All pages are statically generated at build time using Next.js SSG

### Key Components Structure

- `src/pages/` - Next.js pages (index for search, drug/[id] for details)
- `src/components/` - React components organized by feature
  - `common/` - Reusable UI components
  - `drug/` - Drug detail page components
  - `search/` - Search-related components
- `src/lib/` - Core utilities and business logic
  - `search.ts` - Main search implementation with Fuse.js
  - `types.ts` - TypeScript type definitions (Drug interface)
  - `config.ts` - Site configuration

### Search Functionality

The search supports multiple methods:

- Chinese generic name (通用名) and brand name (商品名)
- English brand names
- Manufacturer/MAH names (上市许可持有人)
- Pinyin (both full pinyin and abbreviations)
- Fuzzy matching with weighted scoring

Search implementation details are in `src/lib/search.ts` with the main logic in `searchDrugs()` function.

### Drug Data Structure

Each drug object contains:

- Basic info: ID, generic/brand names (CN/EN), specifications
- Registration: Type (domestic/foreign), approval numbers
- Company info: MAH, manufacturer, packaging company
- Original drug status and sources
- Optional drug images

See `src/lib/types.ts` for the complete Drug interface definition.

## Important Technical Details

### TypeScript Configuration

- Extremely strict TypeScript settings with all strict flags enabled
- No implicit any allowed
- Exact optional property types required
- Path alias: `@/*` maps to `src/*`

### Static Site Generation

- All drug detail pages are pre-generated at build time
- Use `getStaticPaths` and `getStaticProps` for new static pages
- Drug URLs follow pattern: `/drug/[id]` where ID is the drug's unique identifier

### SEO Considerations

- Site uses next-seo for meta tags
- Sitemap is auto-generated post-build
- All pages should include proper SEO metadata using the `SEO` component

### Styling

- Tailwind CSS for styling
- Custom CSS variables defined in globals.css
- Responsive design with mobile-first approach

## Common Tasks

### Adding New Drug Data

1. Update `src/data/drugs.json` with new drug entries
2. Ensure data follows the Drug interface in `src/lib/types.ts`
3. Run `pnpm build` to generate new static pages

### Modifying Search Logic

- Main search implementation: `src/lib/search.ts`
- Search component: `src/components/search/SearchResults.tsx`
- Pinyin generation is automatic via pinyin-pro library

### Working with Drug Images

- Drug images are stored in `public/drugs/`
- Use the `BaseDrugImage` component for consistent image display
- Images are optional - handle missing images gracefully

## Production Deployment

- Site is deployed at [https://yuanyanyao.org](https://yuanyanyao.org)
- Optimized for Vercel deployment
- No environment variables required - all data is static

## Project Context

This web application is part of the yuanyanyao project series - a comprehensive original/innovator drug (原研药) database ecosystem:

### Project Series Overview

1. **yuanyanyao** (Core Database)
   - Repository: `github.com/dongzhenye/yuanyanyao`
   - Purpose: Authoritative drug data with community maintenance
   - License: CC-BY-SA 4.0 (data sharing with attribution)
   - Status: Open source after initial development

2. **yuanyanyao-web** (This Project)
   - Repository: `github.com/dongzhenye/yuanyanyao-web`
   - Purpose: Public-facing search website
   - License: MIT (open source)
   - Status: Live at [https://yuanyanyao.org](https://yuanyanyao.org)

3. **yuanyanyao-ios** (Mobile App)
   - Repository: `github.com/dongzhenye/yuanyanyao-ios`
   - Purpose: iOS application for mobile users
   - License: Proprietary
   - Status: Private repository

### Original Drug (原研药) Definition

The project focuses on drugs that meet these criteria:

- **For imported drugs**: Manufacturer matches the originator company
- **For domestic drugs**: Marketing Authorization Holder (MAH) or manufacturer matches the originator
- Special cases are documented in the `originalException` field

### Data Schema Key Fields

The drug data follows a comprehensive schema including:

- **Registration Info**: Type (domestic/foreign), approval numbers
- **Names**: INN, generic name, brand names (CN/EN)
- **Company Info**: MAH, manufacturer, packaging company
- **Original Status**: `isOriginal`, `originator`, `originatorSource`
- **Metadata**: Approval date, last updated, OTC status

### Development Philosophy

1. **User-Centric**: Focus on helping Chinese users find authentic original drugs
2. **Data Quality**: All information must be verifiable through official sources
3. **Community-Driven**: Open source approach for data accuracy and timeliness
4. **SEO-First**: Optimize for search engine visibility to reach users

### Data Sources

- Primary: National Medical Products Administration (NMPA) official data
- Secondary: FDA Orange Book, WHO INN database
- All data must include source references for verification
