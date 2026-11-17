import * as fs from "node:fs/promises";
import * as path from "node:path";

type Point = [number, number];
type Position = Point | string;

type TextOptions = {
  size?: number;
  anchor?: "start" | "middle" | "end";
  weight?: string;
  fill?: string;
  rotate?: number;
  italic?: boolean;
  spacing?: number;
  fit?: number;
};

type Element =
  | ({
      kind: "text";
      x: number;
      y: number;
      text: string;
    } & TextOptions)
  | {
      kind: "rect";
      x: number;
      y: number;
      w: number;
      h: number;
      rx?: number;
      fill?: string;
      stroke?: string;
      sw?: number;
    }
  | {
      kind: "line";
      from: Position;
      to: Position;
      sw?: number;
      color?: string;
    }
  | {
      kind: "cutLine";
      from: Position;
      to: Position;
      sw: number;
      color: string;
      cuts: {
        at: Position;
        width: number;
        label?: string;
        size?: number;
        flip?: boolean;
        weight?: string;
      }[];
      headAt?: "from" | "to";
    }
  | {
      kind: "path";
      d: string;
      sw?: number;
      color?: string;
      fill?: string;
      head?: {
        tip: Point;
        angle: number;
        size?: number;
      };
    }
  | {
      kind: "leg";
      from: Position;
      to: Position;
      sw?: number;
      color?: string;
      startGap?: number;
      stop?: number;
      arrow?: boolean;
      stack?: {
        at: Position;
        distance?: string;
        level?: string;
        name?: string;
      };
      captions?: {
        at: Position;
        text: string;
        size?: number;
      }[];
    }
  | {
      kind: "radial";
      from: Position;
      radius: number;
      bearing: number;
      label: string;
      to: Position;
      labelGap?: number;
    }
  | {
      kind: "hold";
      fix: Position;
      course: number;
      length: number;
      width: number;
      side: "left" | "right";
      extension?: number;
      label?: string;
      tail?: number;
    }
  | {
      kind: "fix";
      at: Position;
      name?: string;
      nameAt?: Point;
      nameSize?: number;
      color?: string;
      radius?: number;
    }
  | {
      kind: "vor";
      at: Position;
      radius: number;
      halo?: boolean;
      transparent?: boolean;
      centre?: "square" | "triangle" | "ring";
    }
  | {
      kind: "frequencyBox";
      x: number;
      y: number;
      w: number;
      h: number;
      title: string;
      frequency: string;
      link: [Position, Position];
    }
  | {
      kind: "arc";
      from: Position;
      to: Position;
      radius: number;
      sweep: 0 | 1;
      sw: number;
      color: string;
    }
  | {
      kind: "arcText";
      from: Position;
      to: Position;
      radius: number;
      sweep: 0 | 1;
      text: string;
      size: number;
      fill: string;
    }
  | {
      kind: "morse";
      at: Point;
      letters: string;
      angle?: number;
      pitch?: number[];
      rowGap?: number;
      unit?: number;
    }
  | {
      kind: "northIndicator";
      at: Point;
      needleTop: number;
      rotate?: number;
    }
  | {
      kind: "quadrant";
      x: number;
      y: number;
      big: string;
      small: string;
    }
  | {
      kind: "clipped";
      children: Element[];
    };

const MORSE_CODE: Record<string, string> = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
};

const INK = "#2b2b2b";
const NAVY = "#555";
const GREY = "#8a8a86";
const BROWN = "#6b5b3a";
const MAGENTA = "#b03070";

/**
 * Build tool (not used at run time): renders a Jeppesen-style aeronautical
 * chart as a crisp vector SVG from a plain JSON description.
 *
 * LLM INSTRUCTIONS: HOW TO BUILD THE INPUT FROM A CHART IMAGE
 *
 * 1. Work in the pixel coordinates of the source image. Set `width` and
 *    `height` to the image size and `scale` to 1 (the SVG then has the same
 *    pixel size as the image). Origin is top-left, y grows downwards.
 * 2. Inspect the image at zoom (crop and enlarge regions) and measure every
 *    coordinate; never guess from the full image. Re-render, overlay or
 *    place the result next to the original, and correct mismatches.
 * 3. If the chart has a framed map area, set `map: { x, y, w, h }`. Elements
 *    wrapped in a `clipped` element, and the terrain, are cut to that frame.
 * 4. Optionally name reused positions in `points` ({ "SUMMO": [938, 564] })
 *    and use the name anywhere a Position is accepted.
 * 5. List `elements` in paint order (first = bottom). Typical order:
 *    terrain and grey areas, MSA arcs, tracks and legs, holds, fixes,
 *    navaids, text, boxes and tables on top.
 * 6. Prefer the semantic elements below over raw paths: they reproduce the
 *    Jeppesen conventions (label alignment, arrowheads stopping at fixes,
 *    leg label stacks, Morse idents) so labels stay aligned with their lines.
 * 7. Use `path` only for shapes without a semantic element (terrain
 *    contours, turn curves, arrows, wedges, airfield blobs). `d` is an SVG
 *    path string. Terrain contours: trace them as many-point smooth paths
 *    with a thin grey/black stroke (sw ~1.1).
 * 8. Match text widths with `fit` (measured pixel width of the original
 *    string); the typeface is Helvetica so widths otherwise differ.
 * 9. Navaids with a Morse ident (VOR, NDB, DME frequency boxes, such as
 *    "ALT" or "VSJ"): add a `morse` element with the ident letters. Never
 *    draw dots and dashes by hand.
 *
 * INPUT SHAPE
 *   {
 *     width, height, scale?,            // image pixels, scale default 2
 *     map?: { x, y, w, h },             // framed map area
 *     terrain?: { fill, d }[],          // filled even-odd paths in the frame
 *     graticule?: { vertical: number[], horizontal: number[] },
 *     points?: Record<string, [x, y]>,  // named positions
 *     elements: Element[]
 *   }
 *   Position = [x, y] | name from `points`.
 *
 * ELEMENTS (`kind` discriminates)
 *   text      { x, y, text, size?, anchor?: start|middle|end, weight?,
 *               fill?, rotate? (degrees, about x,y), italic?, spacing?,
 *               fit? (target pixel width) }  (x,y = baseline anchor point)
 *   rect      { x, y, w, h, rx?, fill? (default white; "none" for an
 *               outline), stroke?, sw? }
 *   line      { from, to, sw?, color? }
 *   cutLine   { from, to, sw, color, cuts: [{ at, width, label?, size?,
 *               flip?, weight? }], headAt?: "from" | "to" }
 *             a line with gaps holding labels rotated along it (radial
 *             bearings such as "245°"); `at` is projected onto the line.
 *             A cut without label is a plain gap. `flip` reads the label
 *             upside-down-corrected the other way.
 *   path      { d, sw? (0 = no stroke), color?, fill?, head?: { tip, angle
 *               (degrees, direction the arrow points), size? } }
 *   leg       { from, to, sw?, color?, startGap?, stop? (gap before the
 *               end point, default 6 when `to` is a name), arrow?,
 *               stack?: { at, distance?, level?, name? },
 *               captions?: [{ at, text, size? }] }
 *             standard route leg: distance above the line, level and name
 *             below, all aligned along the track.
 *   radial    { from, radius, bearing, label, to, labelGap? }  bearing
 *             label just outside a VOR circle, followed by the track line.
 *   hold      { fix, course, length, width, side: left|right, extension?,
 *               label?, tail? }  racetrack hold pattern at a fix.
 *   fix       { at, name?, nameAt?, nameSize?, color?, radius? }  triangle.
 *   vor       { at, radius, halo?, transparent?, centre? }  compass VOR
 *             with ticks. `centre`: "square" (default, square and
 *             hexagon), "triangle" (octagon ring and triangle) or "ring"
 *             (octagon ring and a dot). `transparent` shows what is below.
 *   frequencyBox { x, y, w, h, title, frequency, link: [Position,
 *             Position] }  navaid box with Morse-style bars and a link line.
 *   arc       { from, to, radius, sweep: 0|1, sw, color }  circular arc
 *             through two points (MSA sectors). Use the radius that fits
 *             the real arc: centre = intersection implied by from/to.
 *   arcText   { from, to, radius, sweep, text, size, fill }  text along a
 *             circle; give points on a circle concentric with the MSA arc,
 *             a few pixels inside it, so the label is tangent to the arc.
 *   morse     { at, letters, angle?, pitch?, rowGap?, unit? }  Morse code
 *             for `letters`. `at` is the left-centre start of the first
 *             letter. Default: letters in a row, `pitch[i]` = offset of
 *             letter i along the row. With `rowGap`: one row per letter,
 *             stacked perpendicular to the row. `angle` rotates the whole
 *             block (use the angle of the line it sits along).
 *   northIndicator { at (globe centre), needleTop (y of the needle tip),
 *             rotate? (degrees about `at`, for charts printed sideways) }
 *             Jeppesen north needle, "N", globe with wings.
 *   quadrant  { x, y, big, small }  quadrant elevation figure (e.g. 6 2).
 *   clipped   { children: Element[] }  children clipped to `map`.
 *
 * Returns the SVG document as a string.
 */
export const generateJeppesenLikeChart = (chart: {
  width: number;
  height: number;
  scale?: number;
  map?: { x: number; y: number; w: number; h: number };
  terrain?: { fill: string; d: string }[];
  graticule?: { vertical: number[]; horizontal: number[] };
  points?: Record<string, Point>;
  elements: Element[];
}) => {
  const out: string[] = [];
  let arcTextCount = 0;

  const resolve = (position: Position): Point => {
    if (typeof position !== "string") return position;
    const found = chart.points?.[position];
    if (!found) throw new Error(`Unknown point "${position}"`);
    return found;
  };

  const format = (value: number) => value.toFixed(1);

  const direction = (from: Point, to: Point) => {
    const length = Math.hypot(to[0] - from[0], to[1] - from[1]);
    return {
      length,
      ux: (to[0] - from[0]) / length,
      uy: (to[1] - from[1]) / length,
    };
  };

  const readableAngle = (ux: number, uy: number) => {
    const degrees = (Math.atan2(uy, ux) * 180) / Math.PI;
    if (degrees > 90) return degrees - 180;
    if (degrees < -90) return degrees + 180;
    return degrees;
  };

  const drawText = (
    x: number,
    y: number,
    text: string,
    options: TextOptions = {},
  ) => {
    const transform =
      options.rotate === undefined
        ? ""
        : ` transform="rotate(${format(options.rotate)} ${x} ${y})"`;
    const italic = options.italic ? ' font-style="italic"' : "";
    const spacing = options.spacing
      ? ` letter-spacing="${options.spacing}"`
      : "";
    const fit = options.fit
      ? ` textLength="${options.fit}" lengthAdjust="spacingAndGlyphs"`
      : "";
    out.push(
      `<text x="${x}" y="${y}"${fit} font-size="${options.size ?? 10}" text-anchor="${options.anchor ?? "start"}" fill="${options.fill ?? INK}" font-weight="${options.weight ?? "normal"}"${transform}${italic}${spacing}>${text}</text>`,
    );
  };

  const drawAlignedText = (
    at: Point,
    angle: number,
    text: string,
    options: TextOptions & { offset?: number },
  ) => {
    const size = options.size ?? 10;
    out.push(
      `<text transform="translate(${format(at[0])} ${format(at[1])}) rotate(${format(angle)})" y="${options.offset ?? size * 0.35}" font-size="${size}" text-anchor="${options.anchor ?? "middle"}" fill="${options.fill ?? NAVY}" font-weight="${options.weight ?? "normal"}">${text}</text>`,
    );
  };

  const drawLine = (
    from: Point,
    to: Point,
    sw = 1.2,
    color = INK,
    cap = "butt",
  ) => {
    out.push(
      `<line x1="${format(from[0])}" y1="${format(from[1])}" x2="${format(to[0])}" y2="${format(to[1])}" stroke="${color}" stroke-width="${sw}" stroke-linecap="${cap}"/>`,
    );
  };

  const drawHead = (
    tip: Point,
    ux: number,
    uy: number,
    color = INK,
    size = 7,
    spread = 0.35,
  ) => {
    const left: Point = [
      tip[0] - size * Math.cos(Math.atan2(uy, ux) - spread),
      tip[1] - size * Math.sin(Math.atan2(uy, ux) - spread),
    ];
    const right: Point = [
      tip[0] - size * Math.cos(Math.atan2(uy, ux) + spread),
      tip[1] - size * Math.sin(Math.atan2(uy, ux) + spread),
    ];
    out.push(
      `<polygon points="${format(tip[0])},${format(tip[1])} ${format(left[0])},${format(left[1])} ${format(right[0])},${format(right[1])}" fill="${color}"/>`,
    );
  };

  const drawTriangle = (at: Point, radius: number, color: string) => {
    out.push(
      `<polygon points="${format(at[0])},${format(at[1] - radius)} ${format(at[0] - radius)},${format(at[1] + radius * 0.8)} ${format(at[0] + radius)},${format(at[1] + radius * 0.8)}" fill="#fff" stroke="${color}" stroke-width="1.1"/>`,
    );
  };

  const drawVor = (
    at: Point,
    radius: number,
    halo: boolean,
    transparent: boolean,
    centre: "square" | "triangle" | "ring",
  ) => {
    const [x, y] = at;
    const k = radius / 19;
    if (halo) {
      out.push(
        `<circle cx="${x}" cy="${y}" r="${radius + 9 * k}" fill="#cfcfcf" opacity=".5"/>`,
      );
    }
    out.push(
      `<circle cx="${x}" cy="${y}" r="${radius}" fill="${transparent ? "none" : "#fff"}" stroke="${INK}" stroke-width="${1.2 * k}"/>`,
    );
    Array.from({ length: 12 }, (_, tick) => tick).forEach((tick) => {
      const angle = (tick * Math.PI) / 6;
      const cardinal = tick % 3 === 0;
      const inner = radius - (cardinal ? 5.5 : 3) * k;
      const outer = radius + (cardinal ? 1.5 : 0) * k;
      drawLine(
        [x + inner * Math.cos(angle), y + inner * Math.sin(angle)],
        [x + outer * Math.cos(angle), y + outer * Math.sin(angle)],
        (cardinal ? 1.1 : 0.8) * k,
      );
    });
    if (centre !== "square") {
      const ring = Array.from({ length: 8 }, (_, corner) => corner)
        .map((corner) => {
          const angle = Math.PI / 8 + (corner * Math.PI) / 4;
          return `${format(x + 10.8 * k * Math.cos(angle))},${format(y + 10.8 * k * Math.sin(angle))}`;
        })
        .join(" ");
      out.push(
        `<polygon points="${ring}" fill="${transparent ? "none" : "#fff"}" stroke="${INK}" stroke-width="${2.1 * k}" stroke-linejoin="round"/>`,
      );
      if (centre === "ring") {
        out.push(
          `<circle cx="${x}" cy="${y}" r="${1.1 * k}" fill="#fff" stroke="${INK}" stroke-width="${0.8 * k}"/>`,
        );
        return;
      }
      out.push(
        `<polygon points="${format(x - 6 * k)},${y} ${format(x + 3.2 * k)},${format(y - 5.8 * k)} ${format(x + 3.2 * k)},${format(y + 5.8 * k)}" fill="none" stroke="${INK}" stroke-width="${1.1 * k}"/>`,
      );
      return;
    }
    out.push(
      `<rect x="${x - 6.5 * k}" y="${y - 5.5 * k}" width="${13 * k}" height="${11 * k}" fill="#fff" stroke="${INK}" stroke-width="${1.1 * k}"/>`,
    );
    const hexagon = Array.from({ length: 6 }, (_, corner) => corner)
      .map((corner) => {
        const angle = Math.PI / 6 + (corner * Math.PI) / 3;
        return `${format(x + 4.6 * k * Math.cos(angle))},${format(y + 4.6 * k * Math.sin(angle))}`;
      })
      .join(" ");
    out.push(`<polygon points="${hexagon}" fill="${INK}"/>`);
    out.push(`<circle cx="${x}" cy="${y}" r="${1.1 * k}" fill="#fff"/>`);
  };

  const drawCutLine = (
    from: Point,
    to: Point,
    sw: number,
    color: string,
    cuts: {
      at: Position;
      width: number;
      label?: string;
      size?: number;
      flip?: boolean;
      weight?: string;
    }[],
    headAt?: "from" | "to",
  ) => {
    const { length, ux, uy } = direction(from, to);
    const sorted = cuts
      .map((cut) => {
        const at = resolve(cut.at);
        const distance = (at[0] - from[0]) * ux + (at[1] - from[1]) * uy;
        return { ...cut, distance };
      })
      .toSorted((a, b) => a.distance - b.distance);
    const stops = [
      0,
      ...sorted.flatMap((cut) => [
        cut.distance - cut.width / 2,
        cut.distance + cut.width / 2,
      ]),
      length,
    ];
    Array.from({ length: stops.length / 2 }, (_, index) => index).forEach(
      (index) => {
        const start = stops[index * 2];
        const end = stops[index * 2 + 1];
        if (end - start < 0.5) return;
        drawLine(
          [from[0] + ux * start, from[1] + uy * start],
          [from[0] + ux * end, from[1] + uy * end],
          sw,
          color,
        );
      },
    );
    sorted.forEach((cut) => {
      if (!cut.label) return;
      const angle = readableAngle(ux, uy) + (cut.flip ? 180 : 0);
      drawAlignedText(
        [from[0] + ux * cut.distance, from[1] + uy * cut.distance],
        angle,
        cut.label,
        {
          size: cut.size ?? 10.5,
          weight: cut.weight ?? "bold",
          fill: INK,
        },
      );
    });
    const headSize = Math.max(7, sw * 3.6);
    if (headAt === "to") drawHead(to, ux, uy, color, headSize);
    if (headAt === "from") drawHead(from, -ux, -uy, color, headSize);
  };

  const drawElement = (element: Element) => {
    if (element.kind === "text") {
      const { kind, x, y, text, ...options } = element;
      drawText(x, y, text, options);
      return;
    }

    if (element.kind === "rect") {
      out.push(
        `<rect x="${element.x}" y="${element.y}" width="${element.w}" height="${element.h}" rx="${element.rx ?? 0}" fill="${element.fill ?? "#fff"}" stroke="${element.stroke ?? "none"}" stroke-width="${element.sw ?? 1}"/>`,
      );
      return;
    }

    if (element.kind === "line") {
      drawLine(
        resolve(element.from),
        resolve(element.to),
        element.sw,
        element.color,
      );
      return;
    }

    if (element.kind === "cutLine") {
      drawCutLine(
        resolve(element.from),
        resolve(element.to),
        element.sw,
        element.color,
        element.cuts,
        element.headAt,
      );
      return;
    }

    if (element.kind === "path") {
      out.push(
        `<path d="${element.d}" fill="${element.fill ?? "none"}" stroke="${element.color ?? INK}" stroke-width="${element.sw ?? 1.5}"/>`,
      );
      if (element.head) {
        const radians = (element.head.angle * Math.PI) / 180;
        drawHead(
          element.head.tip,
          Math.cos(radians),
          Math.sin(radians),
          element.color ?? INK,
          element.head.size ?? 7,
        );
      }
      return;
    }

    if (element.kind === "leg") {
      const from = resolve(element.from);
      const to = resolve(element.to);
      const { ux, uy } = direction(from, to);
      const stop = element.stop ?? (typeof element.to === "string" ? 6 : 0);
      const startGap = element.startGap ?? 0;
      const color = element.color ?? INK;
      const start: Point = [from[0] + ux * startGap, from[1] + uy * startGap];
      const tip: Point = [to[0] - ux * stop, to[1] - uy * stop];
      drawLine(start, tip, element.sw ?? 1.5, color);
      if (element.arrow !== false) drawHead(tip, ux, uy, color, 7);

      const angle = readableAngle(ux, uy);
      const anchorOf = (at: Position): Point => {
        const target = resolve(at);
        const along = (target[0] - from[0]) * ux + (target[1] - from[1]) * uy;
        return [from[0] + ux * along, from[1] + uy * along];
      };

      element.captions?.forEach((caption) => {
        drawAlignedText(anchorOf(caption.at), angle, caption.text, {
          size: caption.size ?? 9.5,
          offset: -3,
        });
      });

      if (element.stack) {
        const centre = anchorOf(element.stack.at);
        const lines: [string | undefined, number, number, string][] = [
          [element.stack.distance, -3, 7, "normal"],
          [element.stack.level, 9.5, 8.5, "bold"],
          [element.stack.name, 19.5, 8.5, "bold"],
        ];
        lines.forEach(([text, offset, size, weight]) => {
          if (!text) return;
          drawAlignedText(centre, angle, text, { offset, size, weight });
        });
      }
      return;
    }

    if (element.kind === "radial") {
      const from = resolve(element.from);
      const { ux, uy } = direction(from, resolve(element.to));
      const size = 10.5;
      const labelLength = element.label.length * size * 0.5;
      const labelStart = element.radius + (element.labelGap ?? 3);
      drawAlignedText(
        [
          from[0] + ux * (labelStart + labelLength / 2),
          from[1] + uy * (labelStart + labelLength / 2),
        ],
        readableAngle(ux, uy),
        element.label,
        { size },
      );
      const lineStart: Point = [
        from[0] + ux * (labelStart + labelLength + 3),
        from[1] + uy * (labelStart + labelLength + 3),
      ];
      drawElement({
        kind: "leg",
        from: lineStart,
        to: element.to,
        stop: typeof element.to === "string" ? 6 : 0,
      });
      return;
    }

    if (element.kind === "hold") {
      const fix = resolve(element.fix);
      const radians = (element.course * Math.PI) / 180;
      const ux = Math.sin(radians);
      const uy = -Math.cos(radians);
      const rx = element.side === "right" ? -uy : uy;
      const ry = element.side === "right" ? ux : -ux;
      const sweep = element.side === "right" ? 1 : 0;
      const turn = element.width / 2;
      const away: Point = [
        fix[0] - ux * element.length,
        fix[1] - uy * element.length,
      ];
      const fixSide: Point = [
        fix[0] + rx * element.width,
        fix[1] + ry * element.width,
      ];
      const awaySide: Point = [
        away[0] + rx * element.width,
        away[1] + ry * element.width,
      ];
      out.push(
        `<path d="M${format(fix[0])} ${format(fix[1])} A${turn} ${turn} 0 0 ${sweep} ${format(fixSide[0])} ${format(fixSide[1])} L${format(awaySide[0])} ${format(awaySide[1])} A${turn} ${turn} 0 0 ${sweep} ${format(away[0])} ${format(away[1])} Z" fill="none" stroke="${INK}" stroke-width="1"/>`,
      );
      drawHead(
        [
          fixSide[0] - ux * element.length * 0.45 - ux * 3,
          fixSide[1] - uy * element.length * 0.45 - uy * 3,
        ],
        -ux,
        -uy,
        INK,
        7,
        0.45,
      );
      const extension = element.extension ?? 0;
      if (!extension) return;
      const far: Point = [
        fix[0] - ux * (element.length + extension),
        fix[1] - uy * (element.length + extension),
      ];
      drawLine(far, away, 1);
      drawHead(
        [
          fix[0] - ux * element.length * 0.55,
          fix[1] - uy * element.length * 0.55,
        ],
        ux,
        uy,
        INK,
        7,
        0.45,
      );
      if (!element.label) return;
      const labelWidth = element.label.length * 5.5;
      const labelDistance = element.length + extension + 5 + labelWidth / 2;
      drawAlignedText(
        [fix[0] - ux * labelDistance, fix[1] - uy * labelDistance],
        readableAngle(ux, uy),
        element.label,
        { size: 10.5 },
      );
      if (!element.tail) return;
      const tailStart = element.length + extension + 5 + labelWidth + 2;
      drawLine(
        [fix[0] - ux * tailStart, fix[1] - uy * tailStart],
        [
          fix[0] - ux * (tailStart + element.tail),
          fix[1] - uy * (tailStart + element.tail),
        ],
        1,
      );
      return;
    }

    if (element.kind === "fix") {
      const at = resolve(element.at);
      drawTriangle(at, element.radius ?? 5, element.color ?? INK);
      if (element.name && element.nameAt) {
        drawText(element.nameAt[0], element.nameAt[1], element.name, {
          size: element.nameSize ?? 11.5,
          weight: "bold",
          fill: element.color ?? INK,
        });
      }
      return;
    }

    if (element.kind === "vor") {
      drawVor(
        resolve(element.at),
        element.radius,
        element.halo ?? false,
        element.transparent ?? false,
        element.centre ?? "square",
      );
      return;
    }

    if (element.kind === "frequencyBox") {
      const { x, y, w, h } = element;
      out.push(
        `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`,
      );
      out.push(
        `<rect x="${x + 2}" y="${y - 3}" width="${element.title.length * 6 + 4}" height="8" fill="#fff"/>`,
      );
      drawText(x + 4, y + 4, element.title, { size: 8, fill: NAVY });
      drawText(x + w / 2 + 4, y + h - 9, element.frequency, {
        size: 13.5,
        anchor: "middle",
        weight: "500",
      });
      drawText(x + 5, y + 12, "D", { size: 6, fill: NAVY });
      Array.from({ length: 3 }, (_, index) => index).forEach((index) => {
        drawLine(
          [x + 14 + index * 28, y + h - 3.5],
          [x + 24 + index * 28, y + h - 3.5],
          1.2,
        );
      });
      drawLine(resolve(element.link[0]), resolve(element.link[1]), 2.4);
      return;
    }

    if (element.kind === "arc") {
      const from = resolve(element.from);
      const to = resolve(element.to);
      out.push(
        `<path d="M${from[0]} ${from[1]} A${element.radius} ${element.radius} 0 0 ${element.sweep} ${to[0]} ${to[1]}" fill="none" stroke="${element.color}" stroke-width="${element.sw}"/>`,
      );
      return;
    }

    if (element.kind === "arcText") {
      const from = resolve(element.from);
      const to = resolve(element.to);
      arcTextCount += 1;
      out.push(
        `<path id="arc-text-${arcTextCount}" d="M${from[0]} ${from[1]} A${element.radius} ${element.radius} 0 0 ${element.sweep} ${to[0]} ${to[1]}" fill="none"/>`,
      );
      out.push(
        `<text font-size="${element.size}" fill="${element.fill}"><textPath href="#arc-text-${arcTextCount}">${element.text}</textPath></text>`,
      );
      return;
    }

    if (element.kind === "morse") {
      const unit = element.unit ?? 1;
      const dotWidth = 3.4 * unit;
      const dashWidth = 9 * unit;
      const height = 2.8 * unit;
      const gap = 2.8 * unit;
      out.push(
        `<g transform="translate(${element.at[0]} ${element.at[1]}) rotate(${element.angle ?? 0})" fill="${INK}">`,
      );
      [...element.letters].forEach((letter, index) => {
        const originX = element.rowGap ? 0 : (element.pitch?.[index] ?? 0);
        const originY = element.rowGap ? index * element.rowGap : 0;
        [...(MORSE_CODE[letter] ?? "")].reduce((cursor, symbol) => {
          const width = symbol === "-" ? dashWidth : dotWidth;
          out.push(
            `<rect x="${format(cursor)}" y="${format(originY - height / 2)}" width="${format(width)}" height="${format(height)}" rx="${format(0.5 * unit)}"/>`,
          );
          return cursor + width + gap;
        }, originX);
      });
      out.push("</g>");
      return;
    }

    if (element.kind === "northIndicator") {
      const [x, y] = element.at;
      if (element.rotate) {
        out.push(`<g transform="rotate(${element.rotate} ${x} ${y})">`);
      }
      const feathers: [number, number, number][] = [
        [49, -10, -4],
        [44, -5, -1.5],
        [38, -1, 1],
        [31, 3.5, 3.5],
        [24, 7.5, 6],
      ];
      const needleBottom = y - 43;
      drawLine([x, element.needleTop], [x, needleBottom], 1);
      out.push(
        `<polygon points="${x},${element.needleTop + 10} ${x - 2.6},${needleBottom - 2} ${x},${needleBottom - 2}" fill="${INK}"/>`,
      );
      drawText(x, y - 28, "N", { size: 13, anchor: "middle", weight: "500" });
      drawLine([x, y - 17], [x, y - 10], 0.8);
      [-1, 1].forEach((side) => {
        feathers.forEach(([reach, tipY, baseY]) => {
          const midX = x + (side * (8 + reach)) / 2;
          const midY = y + (baseY + tipY) / 2;
          out.push(
            `<path d="M${x + side * 8} ${y + baseY} Q${midX} ${midY - 2.4} ${x + side * reach} ${y + tipY} Q${midX} ${midY + 2.4} ${x + side * 8} ${y + baseY}Z" fill="${INK}" stroke="#fff" stroke-width=".5"/>`,
          );
        });
      });
      out.push(`<circle cx="${x}" cy="${y}" r="11.5" fill="${INK}"/>`);
      out.push(
        `<path d="M${x + 1} ${y + 3.5} q2 -3.2 5 -1.4 q1.2 3.4 -1.2 5.2 q-3 .8 -3.8 -3.8Z M${x - 6} ${y - 4} q3 -4 7 -4.6 q-1.5 2.4 -2.5 4.4 q-2.4 1 -4.5 .2Z" fill="#fff"/>`,
      );
      if (element.rotate) out.push("</g>");
      return;
    }

    if (element.kind === "quadrant") {
      drawText(element.x, element.y, element.big, {
        size: 19,
        anchor: "middle",
        fill: "#6f7a74",
        weight: "bold",
      });
      drawText(element.x + 10, element.y + 4, element.small, {
        size: 11,
        fill: "#6f7a74",
      });
      return;
    }

    out.push('<g clip-path="url(#map-clip)">');
    element.children.forEach(drawElement);
    out.push("</g>");
  };

  const { map } = chart;
  const scale = chart.scale ?? 2;
  out.push(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${chart.width} ${chart.height}" width="${chart.width * scale}" height="${chart.height * scale}" font-family="Helvetica Neue, Arial, sans-serif">`,
  );
  out.push(
    `<rect width="${chart.width}" height="${chart.height}" fill="#fff"/>`,
  );
  if (map) {
    out.push(
      `<clipPath id="map-clip"><rect x="${map.x}" y="${map.y}" width="${map.w}" height="${map.h}"/></clipPath>`,
    );
    out.push('<g clip-path="url(#map-clip)">');
    chart.terrain?.forEach((layer) => {
      out.push(
        `<path d="${layer.d}" fill="${layer.fill}" fill-rule="evenodd"/>`,
      );
    });
    chart.graticule?.vertical.forEach((x) => {
      drawLine([x, map.y], [x, map.y + map.h], 0.6, "#d6d6d6");
    });
    chart.graticule?.horizontal.forEach((y) => {
      drawLine([map.x, y], [map.x + map.w, y], 0.6, "#d6d6d6");
    });
    out.push("</g>");
    out.push(
      `<rect x="${map.x}" y="${map.y}" width="${map.w}" height="${map.h}" fill="none" stroke="${INK}" stroke-width="2"/>`,
    );
  }
  chart.elements.forEach(drawElement);
  out.push("</svg>");
  return out.join("\n");
};

const isMain = process.argv[1] === import.meta.filename;
if (isMain) {
  const inputPath = process.argv[2];
  const outputPath = process.argv[3];
  if (!inputPath || !outputPath) {
    throw new Error("Usage: jeppesen-like-charts.ts <input.json> <output.svg>");
  }
  const input = JSON.parse(await fs.readFile(inputPath, "utf8"));
  await fs.writeFile(outputPath, generateJeppesenLikeChart(input));
  console.log(`Wrote ${path.resolve(outputPath)}`);
}
