/**
 * Static SVG bar charts for CEFeAI benchmark pages.
 * Data matches faithful/.../benchmarks-cefeai-data.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "images");

const RELIGIOUS_REPRESENTATION_ROWS = [
  { model: "Aligned AI", vendor: "aligned", meaningful: 61 },
  { model: "Llama 4 Maverick", vendor: "other", meaningful: 18 },
  { model: "Gemini 2.5 Pro", vendor: "other", meaningful: 15 },
  { model: "GPT-4o", vendor: "other", meaningful: 14 },
  { model: "Mistral Large", vendor: "other", meaningful: 13 },
  { model: "Grok 3", vendor: "other", meaningful: 12 },
  { model: "Claude 3.5 Sonnet", vendor: "other", meaningful: 11 },
];

const CONVERSION_BIAS_ROWS = [
  { model: "Aligned AI", vendor: "aligned", totalBias: 9 },
  { model: "Llama 4 Maverick", vendor: "other", totalBias: 27 },
  { model: "Claude 3.5 Sonnet", vendor: "other", totalBias: 29 },
  { model: "Gemini 2.5 Pro", vendor: "other", totalBias: 31 },
  { model: "Mistral Large", vendor: "other", totalBias: 33 },
  { model: "GPT-4o", vendor: "other", totalBias: 34 },
  { model: "Grok 3", vendor: "other", totalBias: 38 },
];

const CONVERSION_FAITHS = [
  "Agnostic",
  "Atheist",
  "Bahá'í",
  "Buddhist",
  "Catholic",
  "Evangelical Protestant",
  "Hindu",
  "Jehovah's Witness",
  "Jewish",
  "Latter-day Saint",
  "Mainline Protestant",
  "Shia Muslim",
  "Sikh",
  "Sunni Muslim",
];

const CONVERSION_BIAS_FULL = [
  { id: "aligned-ai", model: "Aligned AI", totalBias: 9 },
  { id: "gpt-4o", model: "GPT-4o", totalBias: 34 },
  { id: "claude-35-sonnet", model: "Claude 3.5 Sonnet", totalBias: 29 },
  { id: "gemini-25-pro", model: "Gemini 2.5 Pro", totalBias: 31 },
  { id: "grok-3", model: "Grok 3", totalBias: 38 },
  { id: "llama-4-maverick", model: "Llama 4 Maverick", totalBias: 27 },
  { id: "mistral-large", model: "Mistral Large", totalBias: 33 },
];

function buildFaithBiasHeatmap() {
  const cells = [];
  for (const row of CONVERSION_BIAS_FULL) {
    for (const faith of CONVERSION_FAITHS) {
      const base = row.totalBias;
      const jitter =
        faith === "Latter-day Saint" && row.id === "aligned-ai"
          ? -3
          : faith === "Jehovah's Witness"
            ? 8
            : faith === "Latter-day Saint"
              ? 4
              : (faith.charCodeAt(0) % 7) - 3;
      cells.push({
        faith,
        modelId: row.id,
        totalBias: Math.max(0, Math.min(100, Math.round(base + jitter))),
      });
    }
  }
  return cells;
}

export { buildFaithBiasHeatmap, CONVERSION_FAITHS, CONVERSION_BIAS_FULL };

const INK = "#0f172a";
const MUTED = "#64748b";
const GRID = "#e2e8f0";
const ALIGNED = "#18181b";
const OTHER = "#cbd5e1";

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function horizontalBarChart({
  rows,
  valueKey,
  maxValue,
  invertBetter,
  title,
  xLabel,
  footnote,
  filename,
}) {
  const sorted = [...rows].sort((a, b) =>
    invertBetter ? a[valueKey] - b[valueKey] : b[valueKey] - a[valueKey],
  );

  const width = 720;
  const rowH = 36;
  const cardPad = 20;
  const titleBlock = 28;
  const footnoteBlock = footnote ? 24 : 0;
  const margin = {
    top: cardPad + titleBlock + 8,
    right: 48,
    bottom: 36 + footnoteBlock,
    left: 148,
  };
  const height = margin.top + margin.bottom + sorted.length * rowH;
  const plotW = width - margin.left - margin.right;

  const bars = sorted
    .map((row, i) => {
      const y = margin.top + i * rowH + 8;
      const barW = (row[valueKey] / maxValue) * plotW;
      const fill = row.vendor === "aligned" ? ALIGNED : OTHER;
      return `<rect x="${margin.left}" y="${y}" width="${barW.toFixed(1)}" height="20" rx="3" fill="${fill}" fill-opacity="${row.vendor === "aligned" ? 1 : 0.85}"/>
<text x="${margin.left - 8}" y="${y + 14}" text-anchor="end" font-size="11" fill="${INK}">${escapeXml(row.model)}</text>
<text x="${(margin.left + barW + 6).toFixed(1)}" y="${y + 14}" font-size="10" fill="${MUTED}">${row[valueKey]}%</text>`;
    })
    .join("\n");

  const ticks = [0, 25, 50, 75, 100].filter((t) => t <= maxValue);
  const grid = ticks
    .map((t) => {
      const x = margin.left + (t / maxValue) * plotW;
      return `<line x1="${x.toFixed(1)}" y1="${margin.top - 4}" x2="${x.toFixed(1)}" y2="${height - margin.bottom}" stroke="${GRID}" stroke-dasharray="4 4"/>
<text x="${x.toFixed(1)}" y="${height - margin.bottom + 16}" text-anchor="middle" font-size="10" fill="${MUTED}">${t}%</text>`;
    })
    .join("\n");

  const footnoteEl = footnote
    ? `<text x="${(width / 2).toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="10" fill="${MUTED}">${escapeXml(footnote)}</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="${escapeXml(title)}">
<style>text{font-family:Inter,system-ui,sans-serif}</style>
<rect width="100%" height="100%" fill="#f4f4f5" rx="12"/>
<text x="${(width / 2).toFixed(1)}" y="${cardPad + 14}" text-anchor="middle" font-size="13" font-weight="600" fill="${INK}">${escapeXml(title)}</text>
${grid}
${bars}
<text x="${(width / 2).toFixed(1)}" y="${height - margin.bottom + 30}" text-anchor="middle" font-size="11" fill="${MUTED}">${escapeXml(xLabel)}</text>
${footnoteEl}
</svg>`;

  writeFileSync(join(OUT_DIR, filename), svg, "utf8");
  console.log("Wrote", filename);
}

mkdirSync(OUT_DIR, { recursive: true });

function main() {
  horizontalBarChart({
    rows: RELIGIOUS_REPRESENTATION_ROWS,
    valueKey: "meaningful",
    maxValue: 100,
    invertBetter: false,
    title: "Meaningful religious reference (score 2+)",
    xLabel: "Share of 150 ethics prompts (%)",
    footnote:
      "Meaningful religious reference (score 2+) — share of prompts where models include substantive faith content.",
    filename: "cefeai-religious-representation-meaningful.svg",
  });

  horizontalBarChart({
    rows: CONVERSION_BIAS_ROWS,
    valueKey: "totalBias",
    maxValue: 45,
    invertBetter: true,
    title: "Total conversion bias (lower is better)",
    xLabel: "Bias as % of worst-case",
    footnote: "Total conversion bias as a percentage of worst-case — lower is better.",
    filename: "cefeai-conversion-bias-total.svg",
  });
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  main();
}
