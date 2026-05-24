# Workspace Lux

A fast, SEO-friendly workspace lighting calculator site built with Astro and deployed on Cloudflare Pages.

**Domain:** [workspacelux.com](https://workspacelux.com)

## Features

- Office, desk, lux-to-lumens, and lumens-to-watts calculators
- Color temperature guide for workspace types
- LED lighting savings calculator
- Office lighting standards guide + 2 blog articles
- SEO-optimized pages with FAQ schema, sitemap, and structured data
- Static-first architecture — all calculations run in the browser
- AdSense-ready `AdSlot` component (placeholder until approval)

## Tech Stack

- [Astro 5](https://astro.build) — static site generation
- [Tailwind CSS](https://tailwindcss.com) — styling
- [React](https://react.dev) — interactive calculator components
- TypeScript

## Commands

| Command           | Action                              |
| ----------------- | ----------------------------------- |
| `npm install`     | Install dependencies                |
| `npm run dev`     | Start dev server at localhost:4321  |
| `npm run build`   | Build production site to `./dist/`  |
| `npm run preview` | Preview production build locally    |

## Project Structure

```text
src/
  components/       # Header, Footer, FaqBlock, calculators/
  data/             # tools, faqs, lightingPresets
  layouts/          # BaseLayout, ToolLayout
  lib/              # calculators.ts, formatters.ts
  pages/            # All routes
public/
  robots.txt
  ads.txt
  favicon.svg
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Connect the repo in Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add custom domain `workspacelux.com`

## Environment Variables (optional)

| Variable                     | Purpose                          |
| ---------------------------- | -------------------------------- |
| `PUBLIC_ADSENSE_CLIENT_ID`   | Set to `enabled` to show ad slots |

## Post-Launch Checklist

- [ ] Submit sitemap to Google Search Console
- [ ] Enable Cloudflare Web Analytics
- [ ] Apply for Google AdSense when content is indexed
- [ ] Update `public/ads.txt` with publisher ID after AdSense approval
