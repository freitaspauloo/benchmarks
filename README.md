# Aligned AI Benchmarks (Mintlify)

Benchmark content for Aligned AI — separate from the `faithful` app repo.

**Live site:** https://dudesign.mintlify.io/

**Repo:** https://github.com/freitaspauloo/benchmarks — push to `main` → Mintlify auto-deploys.

**Future domain:** `research.joinaligned.ai` (when DNS is ready)

## Pages (Mintlify)

| URL | Page |
|-----|------|
| https://dudesign.mintlify.io/ | Introduction |
| https://dudesign.mintlify.io/roadmap | Roadmap |
| https://dudesign.mintlify.io/model | Model |
| https://dudesign.mintlify.io/general | General benchmark (Firegraph + tables) |
| https://dudesign.mintlify.io/cefeai | CEFeAI benchmark |

## Local preview

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

## GitHub → Mintlify

Repo: https://github.com/freitaspauloo/benchmarks

Push to `main` → Mintlify deploys to https://dudesign.mintlify.io/

## Structure

| File | Purpose |
|------|---------|
| `index.mdx` | Introduction |
| `roadmap.mdx` | Roadmap |
| `model.mdx` | Model (Fast / Research) |
| `general.mdx` | General benchmark suite |
| `cefeai.mdx` | CEFeAI benchmark suite |
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
