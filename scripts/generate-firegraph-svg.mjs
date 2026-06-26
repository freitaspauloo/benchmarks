/**
 * Generates the General suite Firegraph scatter plot as a static SVG.
 * Data and layout match faithful/client/src/components/docs/benchmarks-industry-charts.tsx
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "images");

const VENDOR_COLORS = {
  aligned: "#16a34a",
  openai: "#64748b",
  xai: "#7c3aed",
  google: "#0ea5e9",
  anthropic: "#d97706",
};

const VENDOR_LABELS = {
  aligned: "Aligned AI",
  openai: "GPT / OpenAI",
  xai: "Grok / xAI",
  google: "Gemini / Google",
  anthropic: "Claude / Anthropic",
};

const POINTS = [
  {
    label: "Aligned AI Fast",
    vendor: "aligned",
    cost: 0.003,
    accuracy: 4.24,
    labelDx: 10,
    labelDy: -16,
    labelAnchor: "start",
  },
  {
    label: "Aligned AI Research",
    vendor: "aligned",
    cost: 0.006,
    accuracy: 4.46,
    labelDx: 10,
    labelDy: -16,
    labelAnchor: "start",
  },
  {
    label: "Gemini 2.5 Flash Lite",
    vendor: "google",
    cost: 0.035,
    accuracy: 2.9,
    labelDx: 10,
    labelDy: 16,
    labelAnchor: "start",
  },
  {
    label: "GPT 4o Mini",
    vendor: "openai",
    cost: 0.045,
    accuracy: 3.05,
    labelDx: 10,
    labelDy: 16,
    labelAnchor: "start",
  },
  {
    label: "Grok 3 Mini",
    vendor: "xai",
    cost: 0.055,
    accuracy: 3.35,
    labelDx: -10,
    labelDy: -16,
    labelAnchor: "end",
  },
  {
    label: "Gemini 2 Flash",
    vendor: "google",
    cost: 0.075,
    accuracy: 3.35,
    labelDx: 10,
    labelDy: 16,
    labelAnchor: "start",
  },
  {
    label: "Opus 4.7",
    vendor: "anthropic",
    cost: 0.12,
    accuracy: 4.52,
    labelDx: -10,
    labelDy: -18,
    labelAnchor: "end",
  },
  {
    label: "GPT 5 Mini",
    vendor: "openai",
    cost: 0.15,
    accuracy: 4.03,
    labelDx: -10,
    labelDy: 18,
    labelAnchor: "end",
  },
  {
    label: "Gemini 2.5 Pro",
    vendor: "google",
    cost: 0.21,
    accuracy: 4.22,
    labelDx: -10,
    labelDy: -18,
    labelAnchor: "end",
  },
  {
    label: "Gemini 3.1 Pro",
    vendor: "google",
    cost: 0.29,
    accuracy: 4.4,
    labelDx: 10,
    labelDy: 20,
    labelAnchor: "start",
  },
  {
    label: "Opus 4.1",
    vendor: "anthropic",
    cost: 0.32,
    accuracy: 4.18,
    labelDx: -10,
    labelDy: 20,
    labelAnchor: "end",
  },
  {
    label: "Grok 3",
    vendor: "xai",
    cost: 0.34,
    accuracy: 4.55,
    labelDx: -10,
    labelDy: -30,
    labelAnchor: "end",
  },
  {
    label: "GPT 5.2",
    vendor: "openai",
    cost: 0.48,
    accuracy: 3.95,
    labelDx: -10,
    labelDy: 20,
    labelAnchor: "end",
  },
];

const LABEL_OFFSETS = [
  { dx: 10, dy: -16, anchor: "start" },
  { dx: 10, dy: 16, anchor: "start" },
  { dx: -10, dy: -16, anchor: "end" },
  { dx: -10, dy: 16, anchor: "end" },
  { dx: 10, dy: -28, anchor: "start" },
  { dx: 10, dy: 28, anchor: "start" },
  { dx: -10, dy: -28, anchor: "end" },
  { dx: -10, dy: 28, anchor: "end" },
  { dx: 14, dy: 0, anchor: "start" },
  { dx: -14, dy: 0, anchor: "end" },
  { dx: 0, dy: -18, anchor: "middle" },
  { dx: 0, dy: 18, anchor: "middle" },
];

const COST_TICKS = [0.001, 0.003, 0.006, 0.02, 0.05, 0.1, 0.2, 0.4, 0.5];
const COST_TICKS_WITHOUT_LABEL = new Set([0.003, 0.006]);
const Y_TICKS = [2.5, 3, 3.5, 4, 4.5, 5];

const INK = "#0f172a";
const MUTED = "#64748b";
const GRID = "#e2e8f0";
const SURFACE = "#ffffff";

function logCost(cost) {
  return Math.log10(cost);
}

function formatCost(cost) {
  if (cost < 0.01) return `$${cost.toFixed(3)}`;
  if (cost < 1) return `$${cost.toFixed(2)}`;
  return `$${cost.toFixed(2)}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function labelBox(label, lx, ly, anchor) {
  const width = label.length * 6.2;
  const height = 14;
  const x =
    anchor === "end" ? lx - width : anchor === "middle" ? lx - width / 2 : lx;
  return { x, y: ly - height / 2, width, height };
}

function boxesOverlap(a, b, pad = 5) {
  return !(
    a.x + a.width + pad <= b.x ||
    b.x + b.width + pad <= a.x ||
    a.y + a.height + pad <= b.y ||
    b.y + b.height + pad <= a.y
  );
}

function resolveLabelPlacements(points, toX, toY) {
  const sorted = [...points].sort((a, b) => {
    const score = (p) => toY(p.accuracy) * 2 + toX(p.cost) / 100;
    return score(a) - score(b);
  });

  const placedBoxes = [];

  for (const point of sorted) {
    const cx = toX(point.cost);
    const cy = toY(point.accuracy);
    const fixed =
      point.labelDx != null && point.labelDy != null && point.labelAnchor;

    const candidates = fixed
      ? [
          {
            dx: point.labelDx,
            dy: point.labelDy,
            anchor: point.labelAnchor,
          },
          ...LABEL_OFFSETS,
        ]
      : LABEL_OFFSETS;

    let chosen = candidates[candidates.length - 1];
    let chosenBox = labelBox(
      point.label,
      cx + chosen.dx,
      cy + chosen.dy,
      chosen.anchor,
    );

    for (const offset of candidates) {
      const candidate = labelBox(
        point.label,
        cx + offset.dx,
        cy + offset.dy,
        offset.anchor,
      );
      if (!placedBoxes.some((existing) => boxesOverlap(candidate, existing))) {
        chosen = offset;
        chosenBox = candidate;
        break;
      }
    }

    placedBoxes.push(chosenBox);
    point.labelDx = chosen.dx;
    point.labelDy = chosen.dy;
    point.labelAnchor = chosen.anchor;
  }

  return points;
}

function buildChart({ costScale, filename, titleSuffix }) {
  const isLog = costScale === "log";
  const chartW = 720;
  const chartH = 420;
  const margin = { top: 22, right: 112, bottom: 46, left: 24 };
  const yAxisW = 44;
  const plotX = margin.left + yAxisW;
  const plotY = margin.top;
  const plotW = chartW - margin.left - margin.right - yAxisW + 44;
  const plotH = chartH - margin.top - margin.bottom;

  const xMin = isLog ? logCost(0.001) : 0;
  const xMax = isLog ? logCost(0.56) : 0.52;
  const yMin = 2.5;
  const yMax = 5.1;

  const toX = (cost) => {
    const v = isLog ? logCost(cost) : cost;
    return plotX + ((v - xMin) / (xMax - xMin)) * plotW;
  };

  const toY = (accuracy) => plotY + ((yMax - accuracy) / (yMax - yMin)) * plotH;

  const labeledPoints = resolveLabelPlacements(
    POINTS.map((point) => ({ ...point })),
    toX,
    toY,
  );

  const xTicks = isLog
    ? COST_TICKS.map((c) => ({ value: logCost(c), label: COST_TICKS_WITHOUT_LABEL.has(c) ? "" : formatCost(c) }))
    : [0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => ({ value: v, label: formatCost(v) }));

  const gridLines = Y_TICKS.map((tick) => {
    const y = toY(tick);
    return `<line x1="${plotX}" y1="${y}" x2="${plotX + plotW}" y2="${y}" stroke="${GRID}" stroke-dasharray="3 3" />`;
  }).join("\n");

  const yAxisLabels = Y_TICKS.map((tick) => {
    const y = toY(tick);
    return `<text x="${plotX - 8}" y="${y + 4}" text-anchor="end" fill="${MUTED}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="500">${tick}</text>`;
  }).join("\n");

  const xAxisLabels = xTicks
    .map(({ value, label }) => {
      if (!label) return "";
      const x = plotX + ((value - xMin) / (xMax - xMin)) * plotW;
      return `<text x="${x}" y="${plotY + plotH + 18}" text-anchor="middle" fill="${MUTED}" font-family="Inter, system-ui, sans-serif" font-size="11" font-weight="500">${escapeXml(label)}</text>`;
    })
    .join("\n");

  const points = labeledPoints.map((p) => {
    const cx = toX(p.cost);
    const cy = toY(p.accuracy);
    const color = VENDOR_COLORS[p.vendor];
    const anchor = p.labelAnchor ?? "start";
    const lx = cx + (p.labelDx ?? 10);
    const ly = cy + (p.labelDy ?? 4);
    return `
      <circle cx="${cx}" cy="${cy}" r="5" fill="${color}" stroke="${color}" stroke-width="1.5" />
      <text x="${lx}" y="${ly}" fill="${INK}" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="500" text-anchor="${anchor}" dominant-baseline="middle" paint-order="stroke" stroke="${SURFACE}" stroke-width="3" stroke-linejoin="round">${escapeXml(p.label)}</text>`;
  }).join("\n");

  const xAxisLabel = `Cost — Avg. cost per chat (${isLog ? "log scale" : "actual scale"})`;
  const chartInner = `
    <g transform="translate(0, 0)">
      ${gridLines}
      <line x1="${plotX}" y1="${plotY}" x2="${plotX}" y2="${plotY + plotH}" stroke="${GRID}" />
      <line x1="${plotX}" y1="${plotY + plotH}" x2="${plotX + plotW}" y2="${plotY + plotH}" stroke="${GRID}" />
      ${yAxisLabels}
      ${xAxisLabels}
      <text x="${plotX + plotW / 2}" y="${plotY + plotH + 40}" text-anchor="middle" fill="${INK}" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="500">${escapeXml(xAxisLabel)}</text>
      <text x="${plotX - 36}" y="${plotY + plotH / 2}" text-anchor="middle" fill="${INK}" font-family="Inter, system-ui, sans-serif" font-size="10" font-weight="500" transform="rotate(-90 ${plotX - 36} ${plotY + plotH / 2})">Accuracy</text>
      ${points}
    </g>`;

  const legendVendors = ["aligned", "openai", "xai", "google", "anthropic"];
  const legendItemW = 145;
  const canvasW = 920;
  const legendStartX = (canvasW - legendVendors.length * legendItemW) / 2;
  const legendY = 548;

  const legend = legendVendors
    .map((vendor, i) => {
      const x = legendStartX + i * legendItemW;
      return `
        <g transform="translate(${x}, ${legendY})">
          <circle cx="0" cy="0" r="6" fill="${VENDOR_COLORS[vendor]}" />
          <text x="14" y="4" fill="#646464" font-family="Inter, system-ui, sans-serif" font-size="13">${escapeXml(VENDOR_LABELS[vendor])}</text>
        </g>`;
    })
    .join("");

  const cardX = 32;
  const cardY = 32;
  const cardW = canvasW - 64;
  const cardH = 480;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="600" viewBox="0 0 ${canvasW} 600" role="img" aria-label="Accuracy vs cost scatter plot${titleSuffix ? `, ${titleSuffix}` : ""}">
  <defs>
    <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="15" flood-color="rgba(15,23,42,0.08)" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#ffffff" rx="16" />
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="12" fill="#ffffff" filter="url(#card-shadow)" />
  <text x="${canvasW / 2}" y="${cardY + 24}" text-anchor="middle" fill="#52525b" font-family="Inter, system-ui, sans-serif" font-size="14" font-weight="500">Accuracy vs. Cost</text>
  <g transform="translate(${cardX + 20}, ${cardY + 44})">
    ${chartInner}
  </g>
  ${legend}
</svg>`;

  return { svg, filename };
}

mkdirSync(OUT_DIR, { recursive: true });

for (const scale of ["log", "actual"]) {
  const { svg, filename } = buildChart({
    costScale: scale,
    filename: `general-accuracy-vs-cost-${scale}.svg`,
    titleSuffix: scale === "log" ? "log scale" : "actual scale",
  });
  const outPath = join(OUT_DIR, filename);
  writeFileSync(outPath, svg, "utf8");
  console.log(`Wrote ${outPath}`);
}
