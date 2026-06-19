# Aligned AI Benchmarks (Mintlify)

Benchmark content for Aligned AI — **not** in the `faithful` app repo.

## Local preview

```bash
npm install
npm run dev
```

Open **http://localhost:3000**

## Connect to Mintlify (one-time, team)

1. Sign in at [app.mintlify.com](https://app.mintlify.com)
2. Create a project (or use existing org project)
3. **Settings → Deployment → Git** — install GitHub app, connect `chriselevow/benchmarks`
4. Push this repo; Mintlify deploys on merge to main

## Mintlify MCP (Cursor)

- Docs search: `https://mintlify.com/docs/mcp`
- Admin / edit: `https://mcp.mintlify.com` (OAuth in Cursor → Tools & MCP)

## Structure

| Path | Purpose |
|------|---------|
| `index.mdx` | Landing (customers-style card grid) |
| `style-guide.mdx` | Component + footnote standards |
| `general/` | Accuracy vs. cost suite |
| `cefeai/` | CEFeAI suite |

## Footnotes (required)

- **General:** accuracy/cost disclaimer (Chris Harper)
- **CEFeAI:** consortium run variability disclaimer
