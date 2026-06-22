# Aligned AI Benchmarks (Mintlify)

Benchmark content for Aligned AI — separate from the `faithful` app repo.

**Live site:** https://dudesign.mintlify.app/

**Repo:** https://github.com/freitaspauloo/benchmarks — push to `main` → Mintlify auto-deploys.

**Future domain:** `research.joinaligned.ai` (when DNS is ready)

## Pages (Mintlify)

| URL | Page |
|-----|------|
| https://dudesign.mintlify.app/ | Benchmarks (single page with tabs) |
| https://dudesign.mintlify.app/#general | General benchmark tab |
| https://dudesign.mintlify.app/#cefeai | CEFeAI benchmark tab |
| https://dudesign.mintlify.app/#model | Model tab |
| https://dudesign.mintlify.app/#roadmap | Roadmap tab |

Legacy paths (`/general`, `/cefeai`, `/model`, `/roadmap`) redirect to the matching tab anchor.

## Local preview

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

## GitHub → Mintlify

Repo: https://github.com/freitaspauloo/benchmarks

Push to `main` → Mintlify deploys to https://dudesign.mintlify.app/

## Structure

| File | Purpose |
|------|---------|
| `index.mdx` | Single benchmarks page — General, CEFeAI, Model, Roadmap tabs |
| `images/` | Firegraph + CEFeAI chart SVGs |
| `scripts/` | `npm run generate:assets` to regenerate charts |

Regenerate chart assets after data changes:

```bash
npm run generate:assets
```

## Public access (one-time dashboard)

If visitors see **Unauthorized**, turn off authentication at https://app.mintlify.com/products/authentication for the **dudesign** project, save, and wait for redeploy.

## Footnotes (required)

- **General:** accuracy/cost disclaimer (Chris Harper)
- **CEFeAI:** consortium run variability disclaimer
