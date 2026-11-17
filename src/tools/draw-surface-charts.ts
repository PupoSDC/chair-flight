import * as fs from "node:fs/promises";
import * as path from "node:path";
import { parse } from "yaml";
import {
  CENTRAL_MERIDIAN,
  LAND,
  PLACES,
  VIEWS,
  WATER,
} from "./surface-chart-basemap.ts";

type Point = [number, number];
type Position = Point | string;
type Chart = {
  description: string;
  view: keyof typeof VIEWS;
  isobars?: {
    through: Position[];
    closed?: boolean;
  }[];
  fronts?: {
    type: "cold" | "warm" | "occluded" | "stationary";
    symbols: "left" | "right";
    through: Position[];
  }[];
  centres?: {
    type: "low" | "high";
    at: Position;
  }[];
  markers?: {
    label: string;
    style: "dot" | "circle" | "box";
    at: Position;
    pointsTo?: Position;
  }[];
};

const CHARTS_FOLDER = path.join(
  "content",
  "question-bank-atpl",
  "annex-charts",
);
const ANNEXES_FOLDER = path.join("content", "question-bank-atpl", "annexes");
const INK = "#111";
const SYMBOL_SIZE = 8;
const SYMBOL_SPACING = 46;

const round = (value: number) => Math.round(value);

const projectPosition = (view: keyof typeof VIEWS, position: Position) => {
  const [longitude, latitude] =
    typeof position === "string" ? PLACES[position] : position;
  const { centreLatitude, span, width, height } = VIEWS[view];
  const radiusOf = (lat: number) => 2 * Math.tan(((90 - lat) * Math.PI) / 360);
  const angle = ((longitude - CENTRAL_MERIDIAN) * Math.PI) / 180;
  const scale = width / span;
  const x = width / 2 + radiusOf(latitude) * Math.sin(angle) * scale;
  const y =
    height / 2 +
    (radiusOf(latitude) * Math.cos(angle) - radiusOf(centreLatitude)) * scale;
  return [x, y] as Point;
};

const calculateControlPoints = (points: Point[], closed: boolean) => {
  const count = points.length;
  const pick = (index: number) => {
    if (closed) return points[(index + count) % count];
    return points[Math.min(count - 1, Math.max(0, index))];
  };
  return Array.from({ length: closed ? count : count - 1 }, (_, index) => {
    const [before, start, end, after] = [-1, 0, 1, 2].map((step) =>
      pick(index + step),
    );
    const first: Point = [
      start[0] + (end[0] - before[0]) / 6,
      start[1] + (end[1] - before[1]) / 6,
    ];
    const second: Point = [
      end[0] - (after[0] - start[0]) / 6,
      end[1] - (after[1] - start[1]) / 6,
    ];
    return [start, first, second, end];
  });
};

const drawPolygon = (points: Point[]) => {
  const [first, ...rest] = points.map(([x, y]) => `${round(x)} ${round(y)}`);
  return `M${first}L${rest.join(" ")}Z`;
};

const drawSpline = (points: Point[], closed: boolean) => {
  const segments = calculateControlPoints(points, closed);
  const curves = segments.map(([, first, second, end]) => {
    return `C${[first, second, end].flat().map(round).join(" ")}`;
  });
  const start = points[0].map(round).join(" ");
  return `M${start}${curves.join("")}${closed ? "Z" : ""}`;
};

const sampleSpline = (points: Point[]) => {
  const steps = Array.from({ length: 12 }, (_, index) => (index + 1) / 12);
  const samples = calculateControlPoints(points, false).flatMap(
    ([start, first, second, end]) => {
      return steps.map((t) => {
        const u = 1 - t;
        const weights = [u ** 3, 3 * u * u * t, 3 * u * t * t, t ** 3];
        const corners = [start, first, second, end];
        return [0, 1].map((axis) => {
          return corners.reduce((sum, c, i) => sum + c[axis] * weights[i], 0);
        }) as Point;
      });
    },
  );
  return [points[0], ...samples];
};

const drawFrontSymbols = (
  points: Point[],
  type: NonNullable<Chart["fronts"]>[number]["type"],
  symbols: "left" | "right",
) => {
  const samples = sampleSpline(points);
  const lengths = samples.slice(1).map((sample, index) => {
    return Math.hypot(
      sample[0] - samples[index][0],
      sample[1] - samples[index][1],
    );
  });
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const count = Math.max(1, Math.round(total / SYMBOL_SPACING));
  const spacing = total / count;
  return Array.from({ length: count }, (_, order) => {
    const target = spacing * (order + 0.5);
    const travelled = lengths.map((_, index) => {
      return lengths.slice(0, index + 1).reduce((sum, l) => sum + l, 0);
    });
    const index = travelled.findIndex((distance) => distance >= target);
    const [from, to] = [samples[index], samples[index + 1]];
    const length = lengths[index] || 1;
    const [tx, ty] = [(to[0] - from[0]) / length, (to[1] - from[1]) / length];
    const alternate = order % 2 === 1;
    const flipped = type === "stationary" && alternate;
    const side = (symbols === "right" ? 1 : -1) * (flipped ? -1 : 1);
    const [nx, ny] = [-ty * side, tx * side];
    const back = [from[0] - tx * SYMBOL_SIZE, from[1] - ty * SYMBOL_SIZE];
    const ahead = [from[0] + tx * SYMBOL_SIZE, from[1] + ty * SYMBOL_SIZE];
    const tip = [
      from[0] + nx * SYMBOL_SIZE * 1.5,
      from[1] + ny * SYMBOL_SIZE * 1.5,
    ];
    const round1 = (values: number[]) => values.map(round).join(" ");
    const pointed = type === "cold" || (type !== "warm" && !alternate);
    if (pointed) return `M${round1(back)}L${round1(tip)}L${round1(ahead)}Z`;
    const sweep = side === 1 ? 0 : 1;
    const radius = SYMBOL_SIZE;
    return `M${round1(back)}A${radius} ${radius} 0 0 ${sweep} ${round1(ahead)}Z`;
  }).join("");
};

const drawSurfaceChart = (chart: Chart) => {
  const { width, height } = VIEWS[chart.view];
  const project = (position: Position) => projectPosition(chart.view, position);
  const drawOutlines = (outlines: Point[][]) => {
    return outlines
      .map((outline) => drawPolygon(outline.map(project)))
      .join("");
  };
  const isobars = (chart.isobars ?? []).map((isobar) => {
    return drawSpline(isobar.through.map(project), isobar.closed ?? false);
  });
  const fronts = (chart.fronts ?? []).map((front) => ({
    points: front.through.map(project),
    type: front.type,
    symbols: front.symbols,
  }));
  const frontLines = fronts.map(({ points }) => drawSpline(points, false));
  const frontSymbols = fronts.map(({ points, type, symbols }) => {
    return drawFrontSymbols(points, type, symbols);
  });
  const centres = (chart.centres ?? []).map((centre) => {
    const [x, y] = project(centre.at).map(round);
    const letter = centre.type === "low" ? "L" : "H";
    return `<text x="${x}" y="${y + 10}" font-size="28">${letter}</text>`;
  });
  const markers = (chart.markers ?? []).map((marker) => {
    const [x, y] = project(marker.at).map(round);
    const pointer = marker.pointsTo
      ? `<path d="M${x} ${y}L${project(marker.pointsTo).map(round).join(" ")}"
          stroke="${INK}"/>`
      : "";
    if (marker.style === "dot") {
      return [
        `<circle cx="${x}" cy="${y}" r="5"/>`,
        `<text x="${x + 12}" y="${y + 7}" text-anchor="start"`,
        ` stroke="#fff" stroke-width="4" paint-order="stroke">`,
        `${marker.label}</text>`,
      ].join("");
    }
    const frame =
      marker.style === "circle"
        ? `<circle cx="${x}" cy="${y}" r="13"`
        : `<rect x="${x - 12}" y="${y - 12}" width="24" height="24"`;
    return [
      pointer,
      `${frame} fill="#fff" stroke="${INK}" stroke-width="1.5"/>`,
      `<text x="${x}" y="${y + 7}">${marker.label}</text>`,
    ].join("");
  });
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">`,
    `<rect width="${width}" height="${height}" fill="#fff"/>`,
    `<path d="${drawOutlines(LAND)}" fill="#ecebe6" stroke="#a9a79f"/>`,
    `<path d="${drawOutlines(WATER)}" fill="#fff" stroke="#a9a79f"/>`,
    `<g fill="none" stroke="${INK}" stroke-linecap="round">`,
    `<path d="${isobars.join("")}" stroke-width="1.5"/>`,
    `<path d="${frontLines.join("")}" stroke-width="3"/></g>`,
    `<g fill="${INK}" font-family="Helvetica,Arial,sans-serif"`,
    ` font-weight="700" font-size="20" text-anchor="middle">`,
    `<path d="${frontSymbols.join("")}"/>`,
    centres.join(""),
    markers.join(""),
    "</g></svg>",
  ].join("");
};

const drawComparisonPage = (
  rows: {
    id: string;
    description: string;
    before: Buffer;
    after: string;
  }[],
) => {
  const sections = rows.map((row) => {
    const original = `data:image/jpeg;base64,${row.before.toString("base64")}`;
    const formatBytes = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
    return [
      `<section><h2>${row.id}</h2><p>${row.description}</p><div>`,
      `<figure><img src="${original}"><figcaption>Before · `,
      `${formatBytes(row.before.length)}</figcaption></figure>`,
      `<figure>${row.after}<figcaption>After · `,
      `${formatBytes(row.after.length)}</figcaption></figure>`,
      "</div></section>",
    ].join("");
  });
  return [
    '<!doctype html><meta charset="utf-8"><title>Surface charts</title>',
    "<style>body{font:14px system-ui;margin:24px;background:#f4f4f2}",
    "h2{font-size:14px}p{max-width:90ch;color:#444}",
    "div{display:grid;grid-template-columns:1fr 1fr;gap:16px}",
    "figure{margin:0}img,svg{width:100%;background:#fff;border:1px solid #ccc}",
    "section{margin-bottom:48px}</style>",
    sections.join(""),
  ].join("");
};

const drawSurfaceCharts = async () => {
  const files = await fs.readdir(CHARTS_FOLDER);
  const ids = files
    .filter((file) => file.endsWith(".yaml"))
    .map((file) => path.basename(file, ".yaml"));
  const rows = await Promise.all(
    ids.map(async (id) => {
      const source = await fs.readFile(
        path.join(CHARTS_FOLDER, `${id}.yaml`),
        "utf-8",
      );
      const chart: Chart = parse(source);
      const svg = drawSurfaceChart(chart);
      await fs.writeFile(path.join(CHARTS_FOLDER, `${id}.svg`), svg);
      const original = await fs.readFile(
        path.join(ANNEXES_FOLDER, `${id}.jpg`),
      );
      return {
        id,
        description: chart.description,
        before: original,
        after: svg,
      };
    }),
  );
  await fs.writeFile(
    path.join(CHARTS_FOLDER, "compare.html"),
    drawComparisonPage(rows),
  );
  const report = rows.map((row) => {
    return `${row.id} ${row.before.length} -> ${row.after.length}`;
  });
  process.stdout.write(`${report.join("\n")}\n`);
};

await drawSurfaceCharts();
