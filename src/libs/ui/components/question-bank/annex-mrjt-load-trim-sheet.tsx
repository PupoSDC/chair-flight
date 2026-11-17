import { cn } from "../../utils/cn";
import type { FC, ReactNode } from "react";

export const MrjtLoadTrimSheet: FC<{
  fields: Record<string, string>;
  className?: string;
}> = ({ fields, className }) => {
  type Align = "left" | "center" | "right";

  const TEXT_ANCHORS = {
    left: "start",
    center: "middle",
    right: "end",
  } as const;

  const DRAWING_WIDTH = 2868;
  const DRAWING_HEIGHT = 2030;
  const POINT = DRAWING_WIDTH / 841.89;
  const INK = "#121212";
  const PAPER = "#ffffff";
  const PEN = "#0d33a6";
  const SOLVED_PEN = "#d11a1a";
  const THIN = 1.4;
  const LINE = 2.2;
  const THICK = 5.5;
  const CELL = 33.3;

  const INDEX_ORIGIN = 1518;
  const INDEX_PITCH = 13.771;
  const MASS_ORIGIN = 1842;
  const MASS_PITCH = 22.9;
  const SCALE_LEFT = 1615;
  const SCALE_RIGHT = 2755;
  const MAC_REFERENCE_INDEX = 49.4;
  const MAC_REFERENCE = 18;
  const MAC_DIVISOR = 15;

  const SECTION_1_ROWS = [295, 373, 452, 530, 608, 688, 767, 845];
  const MASS_BLOCKS = {
    left: 477,
    zeroFuel: 880,
    takeOff: 1047,
    landing: 1218,
  };
  const LOAD_ROWS = [
    { label: "Tr", top: 0, bottom: 38 },
    { label: "B", top: 38, bottom: 77 },
    { label: "C", top: 77, bottom: 115 },
    { label: "M", top: 115, bottom: 152 },
  ];
  const LOAD_BLOCK_TOPS = [923, 1113];
  const SECTION_3_ROWS = [1417, 1453, 1490, 1565, 1603, 1678, 1715, 1788];
  const INDEX_SCALES = [
    {
      cpt: "1",
      top: 515,
      bottom: 567,
      first: 1810,
      pitch: 195,
      parts: 10,
      label: "PITCH 1000 kg",
      labelFrom: 1615,
      labelTo: 1810,
      direction: "left",
      maximum: "3305",
    },
    {
      cpt: "4",
      top: 567,
      bottom: 617,
      first: 1777,
      pitch: 162.5,
      parts: 10,
      label: "PITCH 1000 kg",
      labelFrom: 2590,
      labelTo: 2748,
      direction: "right",
      maximum: "4187",
    },
    {
      cpt: "0a",
      top: 617,
      bottom: 669,
      first: 1829,
      pitch: 214,
      parts: 10,
      label: "PITCH 10 Pax",
      labelFrom: 1615,
      labelTo: 1829,
      direction: "left",
      maximum: "15",
    },
    {
      cpt: "0b",
      top: 669,
      bottom: 720,
      first: 1769,
      pitch: 155,
      parts: 10,
      label: "PITCH 10 Pax",
      labelFrom: 1615,
      labelTo: 1769,
      direction: "left",
      maximum: "18",
    },
    {
      cpt: "0c",
      top: 720,
      bottom: 771,
      first: 1700,
      pitch: 84.8,
      parts: 2,
      label: "10 Pax",
      labelFrom: 1615,
      labelTo: 1700,
      direction: "left",
      maximum: "24",
    },
    {
      cpt: "0d",
      top: 771,
      bottom: 818,
      first: 0,
      pitch: 0,
      parts: 0,
      label: "NO EFFECT",
      labelFrom: 0,
      labelTo: 0,
      direction: "none",
      maximum: "24",
    },
    {
      cpt: "0e",
      top: 818,
      bottom: 870,
      first: 1695,
      pitch: 80.2,
      parts: 2,
      label: "10 Pax",
      labelFrom: 2658,
      labelTo: 2738,
      direction: "right",
      maximum: "24",
    },
    {
      cpt: "0f",
      top: 870,
      bottom: 925,
      first: 1765,
      pitch: 149.7,
      parts: 10,
      label: "PITCH 10 Pax",
      labelFrom: 2514,
      labelTo: 2663,
      direction: "right",
      maximum: "18",
    },
    {
      cpt: "0g",
      top: 925,
      bottom: 980,
      first: 1814,
      pitch: 200,
      parts: 10,
      label: "PITCH 10 Pax",
      labelFrom: 2414,
      labelTo: 2614,
      direction: "right",
      maximum: "18",
    },
  ];
  const ENVELOPE_LEFT = [
    [10, 63],
    [12.7, 51.3],
    [33.2, 30],
  ];
  const ENVELOPE_RIGHT = [
    [80.7, 63],
    [74.7, 44.1],
    [49.2, 30],
  ];
  const OPERATIONAL_LIMIT = [
    [80.7, 51.35],
    [17.6, 51.35],
    [18.5, 47.1],
    [35.1, 30],
  ];
  const TRIM_ZONE_LINES = [
    [31.4, 39.9],
    [45.9, 47.5],
    [61.3, 55],
    [76, 62.2],
  ];

  const interpolateIndexAtMass = (points: number[][], mass: number) => {
    const segment = points
      .slice(1)
      .map((end, position) => ({ start: points[position], end }))
      .find(({ end }) => mass >= end[1]);
    if (!segment) return points[points.length - 1][0];
    const { start, end } = segment;
    const ratio = (start[1] - mass) / (start[1] - end[1]);
    return start[0] + ratio * (end[0] - start[0]);
  };

  const calculateIndexAtMac = (mac: number, mass: number) =>
    MAC_REFERENCE_INDEX + (mass * (mac - MAC_REFERENCE)) / MAC_DIVISOR;

  const drawMrjtLoadTrimSheet = (fields: Record<string, string>) => {
    const elements: ReactNode[] = [];

    const toIndexX = (index: number) => INDEX_ORIGIN + INDEX_PITCH * index;
    const toMassY = (mass: number) => MASS_ORIGIN - MASS_PITCH * (mass - 30);

    const drawLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      thickness = LINE,
    ) => {
      elements.push(
        <line
          key={elements.length}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={INK}
          strokeWidth={thickness}
        />,
      );
    };

    const drawBox = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      thickness = LINE,
      filled = false,
    ) => {
      elements.push(
        <rect
          key={elements.length}
          x={x1}
          y={y1}
          width={x2 - x1}
          height={y2 - y1}
          stroke={thickness ? INK : "none"}
          strokeWidth={thickness}
          fill={filled ? PAPER : "none"}
        />,
      );
    };

    const drawPolyline = (points: number[][], thickness = LINE) => {
      points.slice(1).forEach(([x, y], position) => {
        drawLine(points[position][0], points[position][1], x, y, thickness);
      });
    };

    const drawShape = (points: number[][]) => {
      elements.push(
        <polygon
          key={elements.length}
          points={points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill={INK}
        />,
      );
    };

    const drawText = (
      text: string,
      x: number,
      y: number,
      size: number,
      align: Align = "left",
      angle = 0,
    ) => {
      elements.push(
        <text
          key={elements.length}
          x={x}
          y={y}
          dy="0.35em"
          fontSize={size}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor={TEXT_ANCHORS[align]}
          fill={INK}
          transform={angle ? `rotate(${-angle} ${x} ${y})` : undefined}
        >
          {text}
        </text>,
      );
    };

    const drawArrowHead = (x: number, y: number, angle: number, size = 16) => {
      const radians = (angle * Math.PI) / 180;
      const rotate = ([dx, dy]: number[]) => [
        x + dx * Math.cos(radians) + dy * Math.sin(radians),
        y - dx * Math.sin(radians) + dy * Math.cos(radians),
      ];
      drawShape(
        [
          [0, 0],
          [-size, -size / 3],
          [-size, size / 3],
        ].map(rotate),
      );
    };

    const drawTickedBox = (
      x1: number,
      x2: number,
      y1: number,
      y2: number,
      cells: number,
    ) => {
      drawBox(x1, y1, x2, y2);
      Array.from({ length: cells - 1 }, (_, position) => {
        const x = x1 + ((x2 - x1) * (position + 1)) / cells;
        return drawLine(x, y2 - 12, x, y2, THIN);
      });
    };

    const drawCells = (
      x: number,
      y1: number,
      y2: number,
      cells: number,
      width = CELL,
    ) => {
      Array.from({ length: cells + 1 }, (_, position) =>
        drawLine(x + position * width, y1, x + position * width, y2, THIN),
      );
    };

    const drawLabelArrow = (
      text: string,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      size: number,
    ) => {
      const middle = (y1 + y2) / 2;
      drawBox(x1, y1, x2 - 26, y2, THIN);
      drawBox(x1 + 4, y1 + 4, x2 - 30, y2 - 4, THIN);
      drawShape([
        [x2 - 30, y1 - 8],
        [x2, middle],
        [x2 - 30, y2 + 8],
      ]);
      text.split("\n").forEach((row, position, rows) => {
        drawText(
          row,
          x1 + 9,
          middle + (position - (rows.length - 1) / 2) * size * 0.95,
          size,
        );
      });
    };

    const solvedFields = (fields.solved ?? "").split(",");

    const drawFieldText = (
      name: string,
      value: string,
      centers: number[],
      y: number,
      size: number,
    ) => {
      elements.push(
        <text
          key={elements.length}
          x={centers.join(" ")}
          y={y}
          dy="0.35em"
          fontSize={size}
          fontFamily="Helvetica, Arial, sans-serif"
          textAnchor="middle"
          fill={solvedFields.includes(name) ? SOLVED_PEN : PEN}
        >
          {value}
        </text>,
      );
    };

    const addCombField = (
      name: string,
      x: number,
      y1: number,
      y2: number,
      cells = 5,
      width = CELL,
    ) => {
      const characters = [...(fields[name] ?? "")].slice(-cells);
      if (characters.length === 0) return;
      const centers = characters.map(
        (_, position) =>
          x + (cells - characters.length + position + 0.5) * width,
      );
      drawFieldText(
        name,
        characters.join(""),
        centers,
        (y1 + y2) / 2,
        10 * POINT,
      );
    };

    const addTextField = (
      name: string,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      size = 9.5,
    ) => {
      const value = fields[name];
      if (!value) return;
      drawFieldText(name, value, [(x1 + x2) / 2], (y1 + y2) / 2, size * POINT);
    };

    drawBox(0, 0, DRAWING_WIDTH, DRAWING_HEIGHT, 0, true);
    drawText("Load & Trim Sheet", 2515, 96, 40, "right");
    drawText("JAA  -  FCL  Twin Jet", 2515, 145, 40, "right");

    drawPolyline(
      [
        [140, 1898],
        [140, 88],
        [1090, 88],
        [1090, 177],
        [2755, 177],
        [2755, 1898],
        [140, 1898],
      ],
      THICK,
    );
    drawLine(1386, 177, 1386, 1898, THICK);

    drawText("Prefix", 148, 112, 22);
    drawText("Addresses", 250, 112, 22);
    drawBox(148, 125, 215, 157);
    drawLine(148, 125, 215, 157, THIN);
    [250, 515, 783].forEach((x) => {
      drawTickedBox(x, x + 234, 125, 157, 7);
    });
    [222, 487, 755].forEach((x) => {
      drawLine(x, 141, x + 20, 141, THIN);
      drawArrowHead(x + 24, 141, 0, 9);
    });
    drawText("Originator", 148, 177, 22);
    drawText("Recharge   Date/Time", 448, 177, 22);
    drawText("initials", 782, 174, 22);
    drawTickedBox(148, 415, 190, 222, 8);
    drawTickedBox(450, 750, 190, 222, 9);
    drawBox(795, 190, 850, 222);
    drawLine(795, 190, 850, 222, THIN);
    [422, 757].forEach((x) => {
      drawLine(x, 206, x + 18, 206, THIN);
      drawArrowHead(x + 22, 206, 0, 9);
    });
    drawText("Flight", 148, 243, 22);
    drawText("Date", 424, 243, 22);
    drawText("Registration", 515, 243, 22);
    drawText("Version", 716, 243, 22);
    drawText("Crew", 1066, 243, 22);
    drawTickedBox(148, 482, 253, 287, 10);
    drawLine(402, 287, 415, 255, THIN);
    drawTickedBox(515, 683, 253, 287, 5);
    drawTickedBox(716, 917, 253, 287, 6);
    drawTickedBox(1066, 1167, 253, 287, 3);
    drawLine(1128, 287, 1136, 258, THIN);
    drawBox(1198, 232, 1370, 287);
    drawText("Date", 1204, 247, 22);
    drawText("ALL MASSES IN KILOGRAMS", 1372, 205, 27, "right");

    drawLine(140, 295, 1386, 295, LINE);
    SECTION_1_ROWS.slice(1, -1).forEach((y) => {
      drawLine(643, y, 1386, y);
    });
    [373, 452, 530, 608].forEach((y) => {
      drawLine(140, y, 643, y);
    });
    drawLine(140, 845, 1386, 845, THICK);
    drawLine(643, 295, 643, 845);
    drawLine(880, 295, 880, 845);
    drawLine(1047, 295, 1047, 845, LINE * 1.5);
    drawLine(1215, 295, 1215, 845, LINE * 1.5);
    drawLine(880, 334, 1047, 334);
    drawLine(1215, 334, 1386, 334);
    [412, 491, 569, 647, 727, 806].forEach((y) => {
      drawLine(880, y, 1386, y, THIN);
    });
    drawLine(880, 373, 1047, 373);
    [334, 412, 569].forEach((y) => {
      drawLine(477, y, 643, y, THIN);
    });
    drawCells(MASS_BLOCKS.left, 295, 452, 5);
    drawCells(MASS_BLOCKS.left, 530, 608, 5);
    drawCells(MASS_BLOCKS.zeroFuel, 334, 452, 5);
    drawCells(MASS_BLOCKS.landing, 334, 452, 5);
    drawCells(MASS_BLOCKS.zeroFuel, 491, 845, 5);
    drawCells(MASS_BLOCKS.takeOff, 491, 845, 5);
    drawCells(MASS_BLOCKS.landing, 491, 845, 5);

    drawText("DRY OPERATING MASS", 152, 334, 27);
    drawText("Take-Off Fuel", 152, 412, 25);
    drawText("+", 458, 412, 30, "center");
    drawText("OPERATING MASS", 152, 569, 27);
    drawText("=", 458, 569, 30, "center");
    drawText("Notes:", 152, 632, 25);
    drawLabelArrow("MAXIMUM\nMASSES FOR", 653, 306, 877, 364, 25);
    drawText("ZERO FUEL", 963, 315, 25, "center");
    drawText("TAKE-OFF", 1131, 315, 25, "center");
    drawText("LANDING", 1300, 315, 25, "center");
    drawLabelArrow("TRIP\nFUEL", 1062, 380, 1188, 444, 24);
    drawText("+", 1200, 412, 28, "center");
    [412, 569].forEach((y) => {
      drawLine(662, y, 830, y, LINE * 1.3);
      drawArrowHead(842, y, 0, 18);
    });
    drawText("+", 862, 412, 28, "center");
    drawText("–", 862, 569, 28, "center");
    drawText("Allowed Mass", 752, 467, 24, "center");
    drawText("for Take-Off", 752, 492, 24, "center");
    drawText("Lowest of a, b, c", 752, 517, 24, "center");
    drawText("=", 862, 492, 28, "center");
    drawText("a", 888, 472, 22);
    drawText("b", 1055, 472, 22);
    drawText("c", 1223, 472, 22);
    drawText("Allowed", 738, 636, 24, "center");
    drawText("Traffic Load", 738, 662, 24, "center");
    drawText("=", 862, 648, 28, "center");
    drawText("Total", 738, 715, 24, "center");
    drawText("Traffic Load", 738, 741, 24, "center");
    drawText("–", 862, 727, 28, "center");
    drawText("UNDERLOAD", 738, 794, 24, "center");
    drawText("before LMC", 738, 820, 24, "center");
    drawText("=", 862, 806, 28, "center");

    addCombField("dryOperatingMass", MASS_BLOCKS.left, 334, 373);
    addCombField("takeOffFuel", MASS_BLOCKS.left, 412, 452);
    addCombField("operatingMass", MASS_BLOCKS.left, 530, 569);
    addCombField("maxZeroFuelMass", MASS_BLOCKS.zeroFuel, 334, 373);
    addCombField("takeOffFuel", MASS_BLOCKS.zeroFuel, 412, 452);
    addCombField("maxLandingMass", MASS_BLOCKS.landing, 334, 373);
    addCombField("tripFuel", MASS_BLOCKS.landing, 412, 452);
    addCombField("allowedTakeOffMassA", MASS_BLOCKS.zeroFuel, 491, 530);
    addCombField("maxTakeOffMass", MASS_BLOCKS.takeOff, 491, 530);
    addCombField("allowedTakeOffMassC", MASS_BLOCKS.landing, 491, 530);
    [
      { suffix: "A", x: MASS_BLOCKS.zeroFuel },
      { suffix: "B", x: MASS_BLOCKS.takeOff },
      { suffix: "C", x: MASS_BLOCKS.landing },
    ].forEach(({ suffix, x }) => {
      addCombField(`operatingMass${suffix}`, x, 530, 569);
      addCombField(`allowedTrafficLoad${suffix}`, x, 608, 647);
      addCombField(`totalTrafficLoad${suffix}`, x, 688, 727);
      addCombField(`underload${suffix}`, x, 767, 806);
    });

    drawLine(223, 885, 477, 885, THIN);
    drawLine(643, 885, 1386, 885, THIN);
    drawLine(140, 923, 1386, 923);
    [223, 477, 510, 643, 1107].forEach((x) => {
      drawLine(x, 845, x, 923);
    });
    [286, 349, 412].forEach((x) => {
      drawLine(x, 890, x, 923, THIN);
    });
    [799, 955].forEach((x) => {
      drawLine(x, 885, x, 923);
    });
    [1200, 1293].forEach((x) => {
      drawLine(x, 900, x, 923, THIN);
    });
    drawLine(477, 845, 510, 923, THIN);
    drawLine(510, 845, 477, 923, THIN);
    drawText("Dest.", 181, 886, 25, "center");
    drawText("No. of", 350, 866, 25, "center");
    ["Ma", "Fe", "Ch", "In"].forEach((label, position) => {
      drawText(label, 254 + position * 63.5, 906, 25, "center");
    });
    drawText("TOTAL", 577, 886, 25, "center");
    drawText("DISTRIBUTION MASS", 875, 866, 25, "center");
    ["1", "4", "0"].forEach((label, position) => {
      drawText(label, 721 + position * 155, 905, 25, "center");
    });
    drawText("REMARKS", 1247, 862, 25, "center");
    drawText("PAX", 1247, 889, 25, "center");
    ["F", "C", "Y"].forEach((label, position) => {
      drawText(label, 1154 + position * 93, 910, 25, "center");
    });

    LOAD_BLOCK_TOPS.forEach((top, block) => {
      const suffix = block === 0 ? "" : "2";
      const summary = top + 152;
      drawLine(223, top + 38, 477, top + 38, THIN);
      drawBox(223, top + 38, 477, summary, THIN);
      [286, 349, 412].forEach((x) => {
        drawLine(x, top, x, summary, THIN);
      });
      drawLine(223, top, 223, top + 38, THIN);
      LOAD_ROWS.forEach(({ label, top: rowTop, bottom }) => {
        drawLine(477, top + bottom, 1107, top + bottom, THIN);
        drawText(label, 493, top + (rowTop + bottom) / 2, 24, "center");
      });
      [477, 510].forEach((x) => {
        drawLine(x, top, x, summary, THIN);
      });
      drawLine(1107, top + 38, 1386, top + 38, THIN);
      drawLine(1107, top + 77, 1386, top + 77, THIN);
      [1200, 1293].forEach((x) => {
        drawLine(x, top, x, top + 77, THIN);
      });
      drawText("PAX/", 1114, top + 94, 24);
      [283, 346, 409].forEach((x) => {
        drawLine(x - 6, top + 185, x + 6, top + 160, THIN);
      });
      [".1/", ".4/", ".0/"].forEach((label, position) => {
        drawText(label, 643 + position * 156, top + 172, 22);
      });
      drawLine(140, top + 190, 1386, top + 190, block === 0 ? LINE : THICK);
      ["Male", "Female", "Children", "Infants"].forEach((kind, position) => {
        addTextField(
          `pax${kind}${suffix}`,
          223 + position * 63.5,
          top,
          286 + position * 63.5,
          top + 38,
        );
      });
      LOAD_ROWS.forEach(({ label, top: rowTop, bottom }) => {
        const row = { Tr: "transit", B: "baggage", C: "cargo", M: "mail" }[
          label
        ];
        addCombField(
          `${row}Total${suffix}`,
          510,
          top + rowTop,
          top + bottom,
          4,
        );
        ["1", "4", "0"].forEach((hold, position) => {
          addTextField(
            `${row}${hold}${suffix}`,
            643 + position * 156,
            top + rowTop,
            799 + position * 156,
            top + bottom,
          );
        });
      });
      addCombField(`holdTotal${suffix}`, 510, top + 152, top + 190, 4);
      ["1", "4", "0"].forEach((hold, position) => {
        addTextField(
          `distribution${hold}${suffix}`,
          683 + position * 156,
          top + 152,
          799 + position * 156,
          top + 190,
        );
      });
    });
    [643, 799, 955, 1107].forEach((x) => {
      drawLine(x, 923, x, 1380);
    });
    [1200, 1293].forEach((x) => {
      drawLine(x, 1303, x, 1380, THIN);
    });
    drawCells(510, 923, 1788, 4);
    drawLine(477, 1303, 477, 1788, THIN);

    drawLine(223, 1303, 223, 1417);
    drawBox(223, 1303, 385, 1342, THIN);
    drawLine(477, 1342, 1386, 1342, THIN);
    drawLine(477, 1380, 1386, 1380);
    ["T", "O", "T", "A", "L"].forEach((letter, position) => {
      drawText(letter, 183, 1316 + position * 22, 24, "center");
    });
    drawPolyline(
      [
        [230, 1352],
        [240, 1360],
        [295, 1360],
        [305, 1370],
        [315, 1360],
        [370, 1360],
        [380, 1352],
      ],
      THIN,
    );
    drawLabelArrow("PASSENGER MASS", 227, 1388, 448, 1412, 19);
    drawText("+", 460, 1378, 28, "center");
    drawCells(643, 1380, 1788, 5);
    SECTION_3_ROWS.forEach((y) => {
      drawLine(140, y, 810, y);
    });
    [1527, 1640, 1752].forEach((y) => {
      drawLine(477, y, 810, y, THIN);
    });
    drawBox(140, 1603, 810, 1678, THICK);
    drawLine(810, 1380, 810, 1898);
    [
      { label: "TOTAL TRAFFIC LOAD", sign: "=", y: 1435, size: 26 },
      { label: "Dry Operating Mass", sign: "+", y: 1472, size: 25 },
      { label: "ZERO FUEL MASS", sign: "=", y: 1509, size: 25 },
      { label: "Take-Off Fuel", sign: "+", y: 1585, size: 25 },
      { label: "TAKE-OFF MASS", sign: "=", y: 1621, size: 25 },
      { label: "Trip Fuel", sign: "–", y: 1697, size: 25 },
      { label: "LANDING MASS", sign: "=", y: 1734, size: 25 },
    ].forEach(({ label, sign, y, size }) => {
      drawText(label, 148, y, size);
      const maximum = label === label.toUpperCase() && !label.includes("LOAD");
      drawText(sign, 460, maximum ? y + 20 : y, 28, "center");
      if (!maximum) return;
      drawText("Max.", 172, y + 36, 25);
      drawBox(241, y + 18, 418, y + 52, THIN);
      drawCells(241, y + 18, y + 52, 5, 35.4);
    });

    addCombField("passengerMass", MASS_BLOCKS.left, 1342, 1380);
    addCombField("totalTrafficLoad", MASS_BLOCKS.left, 1417, 1453);
    addCombField("dryOperatingMass", MASS_BLOCKS.left, 1453, 1490);
    addCombField("zeroFuelMass", MASS_BLOCKS.left, 1490, 1527);
    addCombField("takeOffFuel", MASS_BLOCKS.left, 1565, 1603);
    addCombField("takeOffMass", MASS_BLOCKS.left, 1603, 1640);
    addCombField("tripFuel", MASS_BLOCKS.left, 1678, 1715);
    addCombField("landingMass", MASS_BLOCKS.left, 1715, 1752);
    addCombField("maxZeroFuelMassLimit", 241, 1527, 1561, 5, 35.4);
    addCombField("maxTakeOffMassLimit", 241, 1639, 1673, 5, 35.4);
    addCombField("maxLandingMassLimit", 241, 1752, 1786, 5, 35.4);

    drawText("LAST MINUTE CHANGES", 1098, 1399, 26, "center");
    drawLine(810, 1417, 1386, 1417);
    [889, 1065, 1155, 1269].forEach((x) => {
      drawLine(x, 1417, x, 1678, THIN);
    });
    [
      { label: "Dest", x: 849 },
      { label: "Specification", x: 977 },
      { label: "Cl/Cpt", x: 1110 },
      { label: "plus", x: 1212 },
      { label: "minus", x: 1327 },
    ].forEach(({ label, x }) => {
      drawText(label, x, 1434, 25, "center");
    });
    Array.from({ length: 7 }, (_, position) =>
      drawLine(810, 1450 + position * 32.6, 1386, 1450 + position * 32.6, THIN),
    );
    drawLine(810, 1678, 1386, 1678, THICK);
    drawLine(810, 1773, 1386, 1773, THICK);
    [1710, 1742].forEach((y) => {
      drawLine(810, y, 1386, y, THIN);
    });
    drawLine(1155, 1678, 1155, 1773, THIN);
    drawLine(1085, 1745, 1085, 1773, THIN);
    drawText("LOAD LMC (Total)", 820, 1695, 25);
    drawText("TOF Adjustment", 820, 1727, 25);
    drawText("TOTAL LMC  +/–  =", 820, 1759, 25);
    drawLine(810, 1835, 1386, 1835, THIN);
    drawText("Prepared by:", 820, 1793, 25);
    drawText("Approved by:", 820, 1853, 25);

    [
      { label: "Section 1", top: 295, bottom: 845 },
      { label: "Section 2", top: 845, bottom: 1303 },
      { label: "Section 3", top: 1303, bottom: 1898 },
    ].forEach(({ label, top, bottom }) => {
      const middle = (top + bottom) / 2;
      drawLine(100, top, 125, top, THIN);
      drawLine(111, top + 8, 111, middle - 75, THIN);
      drawLine(111, middle + 75, 111, bottom - 8, THIN);
      drawArrowHead(111, top + 2, 90, 16);
      drawArrowHead(111, bottom - 2, -90, 16);
      drawText(label, 113, middle, 30, "center", 90);
    });
    drawLine(100, 1898, 125, 1898, THIN);
    [
      { label: "Part A", left: 142, right: 1384 },
      { label: "Part B", left: 1390, right: 2753 },
    ].forEach(({ label, left, right }) => {
      const middle = (left + right) / 2;
      drawLine(left + 8, 1927, middle - 80, 1927, THIN);
      drawLine(middle + 80, 1927, right - 8, 1927, THIN);
      drawArrowHead(left, 1927, 180, 16);
      drawArrowHead(right, 1927, 0, 16);
      drawText(label, middle, 1927, 32, "center");
    });
    [140, 1386, 2755].forEach((x) => {
      drawLine(x, 1903, x, 1940, THIN);
    });

    drawText("PASSENGER COMPARTMENT DIVISION", 2300, 197, 24, "center");
    const divisionColumns = [
      1867, 2021, 2121, 2221, 2321, 2421, 2521, 2622, 2722,
    ];
    [213, 255, 300, 345].forEach((y) => {
      drawLine(1867, y, 2722, y);
    });
    divisionColumns.forEach((x) => {
      drawLine(x, 213, x, 345);
    });
    [
      ["CPT.", "0a", "0b", "0c", "0d", "0e", "0f", "0g"],
      ["No. of Seats", "15", "18", "24", "24", "24", "18", "18"],
      [
        "Row",
        "1 - 3",
        "4 - 6",
        "7 - 10",
        "11 - 15",
        "16 - 20",
        "21 -23",
        "22 - 26",
      ],
    ].forEach((row, rowPosition) => {
      row.forEach((label, position) => {
        const middle =
          (divisionColumns[position] + divisionColumns[position + 1]) / 2;
        drawText(label, middle, [234, 277, 322][rowPosition], 23, "center");
      });
    });
    drawText("Group/Cockpit Crew", 2433, 368, 23, "center");
    drawText("DRY OPERATING INDEX:", 2295, 413, 24, "right");
    drawBox(2340, 390, 2523, 440);
    drawLine(2425, 432, 2437, 398, THIN);
    drawText("=", 2548, 415, 30, "center");
    drawBox(2575, 390, 2696, 440);
    addTextField("cockpitCrew", 2440, 390, 2523, 440, 11);
    addTextField("dryOperatingIndex", 2575, 390, 2696, 440, 11);

    drawPolyline(
      [
        [1386, 322],
        [1565, 322],
        [1565, 447],
      ],
      LINE * 1.3,
    );
    drawText("MAC at TOM", 1479, 348, 27, "center");
    drawText("...............%", 1410, 416, 27);
    addTextField("macAtTakeOffMass", 1400, 372, 1525, 414, 11);

    drawLine(1386, 447, 2755, 447);
    drawLine(1386, 515, 2755, 515);
    drawLine(1463, 447, 1463, 980);
    drawLine(SCALE_LEFT, 447, SCALE_LEFT, 1042);
    drawText("Cpt.", 1425, 482, 26, "center");
    drawText("MASS / No.", 1539, 482, 26, "center");
    drawText("DRY OPERATING INDEX", 1630, 460, 24);
    Array.from({ length: 82 }, (_, position) => position + 8).forEach(
      (index) => {
        const x = toIndexX(index);
        const height = index % 5 === 0 ? 17 : 10;
        drawLine(x, 515 - height, x, 515, index % 10 === 0 ? LINE : THIN);
        if (index % 10 === 0 && index > 0 && index < 90) {
          drawText(String(index), x, 482, 26, "center");
        }
      },
    );

    INDEX_SCALES.forEach((scale) => {
      const { cpt, top, bottom, first, pitch, parts, label } = scale;
      const middle = (top + bottom) / 2;
      drawLine(1386, bottom, 2755, bottom);
      drawText(cpt, 1425, middle, 27, "center");
      if (cpt.length === 1) {
        drawLine(1463, middle, SCALE_LEFT, middle, THIN);
        drawCells(1463, middle, bottom, 4, 38);
        scale.maximum.split("").forEach((digit, position) => {
          drawText(digit, 1482 + position * 38, middle + 14, 22, "center");
        });
        addCombField(`mass${cpt}`, 1463, top, middle, 4, 38);
      }
      if (cpt.length > 1) {
        drawLine(1503, top, 1503, bottom, THIN);
        drawLine(1503, middle + 4, SCALE_LEFT, middle + 4, THIN);
        drawText(scale.maximum, 1559, middle + 17, 19, "center");
        addTextField(`pax${cpt}`, 1503, top, SCALE_LEFT, middle + 4, 8.5);
      }
      if (scale.direction === "none") {
        drawText(label, 2185, middle, 24, "center");
        return;
      }
      const firstBoundary =
        first - Math.floor((first - SCALE_LEFT) / pitch) * pitch;
      const boundaryCount = Math.ceil((SCALE_RIGHT - firstBoundary) / pitch);
      Array.from({ length: boundaryCount + 1 }, (_, position) => {
        const x = firstBoundary + (position - 1) * pitch;
        if (x > SCALE_LEFT + 2 && x < SCALE_RIGHT - 2) {
          drawLine(x, top, x, bottom, THIN * 1.3);
        }
        return Array.from({ length: parts - 1 }, (_, part) => {
          const tick = x + ((part + 1) * pitch) / parts;
          if (tick < SCALE_LEFT + 6 || tick > SCALE_RIGHT - 4) return undefined;
          const half = (part + 1) * 2 === parts ? 15 : 11;
          return drawLine(tick, middle - half, tick, middle + half, LINE);
        });
      });
      const { labelFrom, labelTo, direction } = scale;
      const boxTop = middle - 2;
      const boxBottom = bottom - 5;
      const arrowAt = direction === "left" ? labelFrom + 2 : labelTo;
      const boxFrom = direction === "left" ? labelFrom + 24 : labelFrom + 2;
      const boxTo = direction === "left" ? labelTo - 1 : labelTo - 22;
      drawBox(labelFrom + 2, top + 2, labelTo - 2, bottom - 2, 0, true);
      drawBox(boxFrom, boxTop, boxTo, boxBottom, THIN, true);
      drawArrowHead(
        arrowAt,
        (boxTop + boxBottom) / 2,
        direction === "left" ? 180 : 0,
        24,
      );
      drawText(
        label,
        (boxFrom + boxTo) / 2,
        (boxTop + boxBottom) / 2,
        18,
        "center",
      );
      const steps = parts === 2 ? 2 : 10;
      Array.from({ length: steps - 1 }, (_, part) => {
        const tick = boxFrom + ((part + 1) * (boxTo - boxFrom)) / steps;
        const height = (part + 1) * 2 === steps ? 14 : 8;
        return drawLine(tick, boxTop - height, tick, boxTop, THIN);
      });
    });

    drawLine(1386, 986, 2755, 986);
    drawLine(1386, 1042, 2755, 1042);
    drawLine(1478, 986, 1478, 1042);
    drawText("FUEL", 1432, 1003, 23, "center");
    drawText("INDEX", 1432, 1027, 23, "center");
    drawText("+", 1498, 1004, 28, "center");
    drawLine(1487, 1017, 1509, 1017, THIN);
    drawText("–", 1498, 1029, 28, "center");
    addTextField("fuelIndex", 1515, 990, SCALE_LEFT, 1038, 9);
    Array.from({ length: 82 }, (_, position) => position + 8).forEach(
      (index) => {
        const x = toIndexX(index) + 1.3;
        const half = index % 5 === 0 ? 15 : 11;
        if (index % 10 === 0) drawLine(x, 986, x, 1042, THIN * 1.3);
        else drawLine(x, 1014 - half, x, 1014 + half, LINE);
      },
    );
    drawBox(1690, 1010, 1815, 1040, 0, true);
    drawBox(1712, 1016, 1793, 1038, THIN, true);
    drawLine(1752, 1016, 1752, 1038, THIN);
    drawArrowHead(1688, 1027, 180, 24);
    drawArrowHead(1817, 1027, 0, 24);
    drawText("–", 1732, 1027, 24, "center");
    drawText("+", 1773, 1027, 24, "center");
    Array.from({ length: 9 }, (_, part) => {
      const tick = 1712 + (part + 1) * 8.1;
      return drawLine(tick, part === 4 ? 1003 : 1008, tick, 1016, THIN);
    });

    drawText(
      "FOR CREW ONLY: STAB. TRIM UNITS FOR T.O. FLAPS 5º ONLY",
      2060,
      1056,
      21,
      "center",
    );
    const chartTop = toMassY(63);
    const chartBottom = toMassY(30);
    drawLine(INDEX_ORIGIN, chartTop, SCALE_RIGHT, chartTop);
    drawLine(INDEX_ORIGIN, chartBottom, SCALE_RIGHT, chartBottom);
    drawLine(INDEX_ORIGIN, chartTop, INDEX_ORIGIN, chartBottom);
    drawText("63,000", 1508, chartTop - 6, 25, "right");
    Array.from({ length: 34 }, (_, position) => position + 30).forEach(
      (mass) => {
        const y = toMassY(mass);
        const major = mass % 5 === 0;
        drawLine(INDEX_ORIGIN - (major ? 16 : 12), y, INDEX_ORIGIN, y, THIN);
        drawLine(SCALE_RIGHT - 14, y, SCALE_RIGHT, y, THIN);
        if (!major) return;
        drawLine(INDEX_ORIGIN, y, SCALE_RIGHT, y, THIN * 1.3);
        drawText(String(mass), 1500, y, 26, "right");
      },
    );
    Array.from({ length: 90 }, (_, index) => index).forEach((index) => {
      const x = toIndexX(index);
      const height = index % 5 === 0 ? 17 : 11;
      drawLine(x, chartBottom, x, chartBottom + height, THIN);
      drawLine(x, chartTop - height + 2, x, chartTop, THIN);
      if (index % 10 !== 0) return;
      drawText(String(index), x, chartBottom + 38, 25, "center");
      if (index > 0) drawLine(x, chartTop, x, chartBottom, THIN * 1.3);
    });
    drawText("INDEX", 1594, chartBottom + 38, 21, "center");
    drawText("x 1000 kg", 1437, 1490, 24, "center", 90);

    Array.from({ length: 17 }, (_, position) => position + 9).forEach((mac) => {
      const masses = Array.from({ length: 661 }, (_, step) => 63 - step * 0.05);
      const inside = masses.filter((mass) => {
        const index = calculateIndexAtMac(mac, mass);
        return (
          index >= interpolateIndexAtMass(ENVELOPE_LEFT, mass) &&
          index <= interpolateIndexAtMass(ENVELOPE_RIGHT, mass)
        );
      });
      const lowest = inside[inside.length - 1];
      drawLine(
        toIndexX(calculateIndexAtMac(mac, 63)),
        chartTop,
        toIndexX(calculateIndexAtMac(mac, lowest)),
        toMassY(lowest),
        THIN,
      );
      const labelMass = mac % 2 === 0 ? 57.8 : 56.5;
      const labelX = toIndexX(calculateIndexAtMac(mac, labelMass));
      const labelY = toMassY(labelMass);
      const halfWidth = mac > 9 ? 17 : 10;
      drawBox(
        labelX - halfWidth,
        labelY - 13,
        labelX + halfWidth,
        labelY + 13,
        0,
        true,
      );
      drawText(String(mac), labelX, labelY, 26, "center");
    });
    TRIM_ZONE_LINES.forEach(([top, bottom]) => {
      const lowest = Array.from({ length: 661 }, (_, step) => 63 - step * 0.05)
        .filter((mass) => {
          const index = top + ((63 - mass) / 33) * (bottom - top);
          return index <= interpolateIndexAtMass(ENVELOPE_RIGHT, mass) + 12;
        })
        .pop();
      const mass = lowest ?? 30;
      drawLine(
        toIndexX(top),
        chartTop,
        toIndexX(top + ((63 - mass) / 33) * (bottom - top)),
        toMassY(mass),
        THIN,
      );
    });
    [ENVELOPE_LEFT, ENVELOPE_RIGHT, OPERATIONAL_LIMIT].forEach((points) => {
      drawPolyline(
        points.map(([index, mass]) => [toIndexX(index), toMassY(mass)]),
        THICK * 0.8,
      );
    });
    drawLine(toIndexX(11.8), toMassY(55), toIndexX(18.5), toMassY(47.1), THIN);
    [
      { label: "5", index: 25.9 },
      { label: "4", index: 47.3 },
      { label: "3", index: 68.4 },
    ].forEach(({ label, index }) => {
      elements.push(
        <circle
          key={elements.length}
          cx={toIndexX(index)}
          cy={1520}
          r={18}
          stroke={INK}
          strokeWidth={THIN}
          fill={PAPER}
        />,
      );
      drawText(label, toIndexX(index), 1520, 27, "center");
    });
    drawText("% MAC", 1535, 1217, 26);
    drawLine(1635, 1217, 1692, 1217, THIN);
    drawArrowHead(1708, 1217, 0, 16);
    drawText("limit LIZFM", 1602, 1655, 25);
    drawLine(1750, 1655, 1830, 1600, THIN);
    drawArrowHead(1846, 1589, 34, 16);
    drawText("operational limit", 1740, 1472, 20, "center", -58);
    drawText("operational limit", 2517, 1565, 20, "center", 42);
    drawText("LMC NOT INCLUDED", 2588, 1790, 26, "center");

    return elements;
  };

  return (
    <svg
      viewBox={`0 0 ${DRAWING_WIDTH} ${DRAWING_HEIGHT}`}
      role="img"
      aria-label="Load and Trim Sheet"
      className={cn("block h-auto w-full bg-white", className)}
    >
      {drawMrjtLoadTrimSheet(fields)}
    </svg>
  );
};
