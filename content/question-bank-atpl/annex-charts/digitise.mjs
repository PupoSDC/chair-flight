import fs from "node:fs";

const LON0 = 5;
const rad = Math.PI / 180;
const proj = ([lon, lat]) => {
  const r = 2 * Math.tan(((90 - lat) * rad) / 2);
  return [r * Math.sin((lon - LON0) * rad), r * Math.cos((lon - LON0) * rad)];
};
const fit = (landmarks) => {
  const z = landmarks.map((l) => proj(l.geo));
  const p = landmarks.map((l) => l.px);
  const mean = (a, k) => a.reduce((s, v) => s + v[k], 0) / a.length;
  const zm = [mean(z, 0), mean(z, 1)], pm = [mean(p, 0), mean(p, 1)];
  let nr = 0, ni = 0, d = 0;
  z.forEach((zz, i) => {
    const [a, b] = [zz[0] - zm[0], zz[1] - zm[1]];
    const [c, e] = [p[i][0] - pm[0], p[i][1] - pm[1]];
    nr += c * a + e * b; ni += e * a - c * b; d += a * a + b * b;
  });
  const ar = nr / d, ai = ni / d;
  const fwd = (zz) => [pm[0] + ar * (zz[0] - zm[0]) - ai * (zz[1] - zm[1]), pm[1] + ai * (zz[0] - zm[0]) + ar * (zz[1] - zm[1])];
  landmarks.forEach((l, i) => console.error(l.name, fwd(z[i]).map(Math.round), l.px));
  const m = ar * ar + ai * ai;
  return ([x, y]) => {
    const [c, e] = [x - pm[0], y - pm[1]];
    const X = (c * ar + e * ai) / m + zm[0], Y = (e * ar - c * ai) / m + zm[1];
    const lon = LON0 + Math.atan2(X, Y) / rad;
    const lat = 90 - (2 * Math.atan(Math.hypot(X, Y) / 2)) / rad;
    return `[${lon.toFixed(1)}, ${lat.toFixed(1)}]`;
  };
};
const emit = (name, spec) => {
  const inv = fit(spec.landmarks);
  const list = (pts) => `[${pts.map(inv).join(", ")}]`;
  const out = [`description: >-`, ...spec.description.map((l) => `  ${l}`), `view: ${spec.view}`, "isobars:"];
  spec.isobars.flatMap((i) => {
    const cuts = [0, ...i.pts.flatMap((p, n) => (p[2] ? [n] : [])), i.pts.length - 1];
    return cuts.slice(1).map((cut, n) => ({ closed: i.closed, pts: i.pts.slice(cuts[n], cut + 1) }));
  }).forEach((i) => {
    out.push(`  - through: ${list(i.pts)}`);
    if (i.closed) out.push("    closed: true");
  });
  out.push("fronts:");
  spec.fronts.forEach((f) => out.push(`  - type: ${f.type}`, `    symbols: ${f.symbols}`, `    through: ${list(f.pts)}`));
  out.push("centres:");
  spec.centres.forEach((c) => out.push(`  - type: ${c.type}`, `    at: ${inv(c.px)}`));
  out.push("markers:");
  spec.markers.forEach((m) => {
    out.push(`  - label: ${m.label}`, `    style: ${m.style}`, `    at: ${m.at ?? inv(m.px)}`);
  });
  fs.writeFileSync(`${process.argv[2]}/${name}.yaml`, out.join("\n") + "\n");
};

emit("050-surface-pressure-europe-050-077", {
  view: "europe",
  description: [
    "Surface pressure chart of Europe and the eastern North Atlantic. A deep",
    "low sits over Ireland and western Britain with tightly packed isobars. Its",
    "cold front trails south-west into the Atlantic, where it becomes the warm",
    "front of the next wave. Its warm front, labelled Z, runs south-east",
    "across southern England and the Channel into France, with point Q just",
    "ahead of it over the southern North Sea. The front continues across the",
    "Alps and turns into a cold front that curves north through the Balkans",
    "and Poland, becoming an occlusion that runs north into a second low over",
    "northern Scandinavia. A warm front branches east from the triple point.",
    "A ridge lies over the Atlantic west of Ireland and another over Germany.",
    "Highs sit south-west of Iberia and over the central Mediterranean.",
  ],
  landmarks: [
    { name: "iceland", geo: [-18.5, 65], px: [385, 95] },
    { name: "corsica", geo: [9, 42.1], px: [738, 570] },
    { name: "sardinia", geo: [9, 40], px: [735, 615] },
    { name: "nw-iberia", geo: [-9, 43.3], px: [437, 562] },
    { name: "danish-isles", geo: [11.5, 55.5], px: [772, 285] },
  ],
  isobars: [
    { closed: true, pts: [[455, 315], [490, 280], [525, 315], [490, 350]] },
    { closed: true, pts: [[430, 318], [490, 258], [550, 318], [490, 378]] },
    { pts: [[455, 405], [410, 330], [430, 250], [490, 225], [560, 255], [582, 320], [570, 365]] },
    { pts: [[425, 448], [385, 330], [420, 230], [500, 195], [590, 240], [606, 320], [598, 392]] },
    { pts: [[-10, 412], [95, 452, 1], [110, 300], [150, 150], [235, 95], [320, 150], [350, 300], [395, 470, 1], [520, 440], [632, 432, 1], [662, 390], [690, 250], [770, 190], [900, 210], [988, 300]] },
    { pts: [[-10, 438], [160, 488, 1], [170, 340], [235, 262], [300, 330], [330, 420], [362, 500, 1], [520, 458], [655, 455, 1], [695, 380], [740, 280], [800, 265], [900, 300], [978, 385]] },
    { pts: [[-10, 463], [215, 510, 1], [200, 430], [250, 390], [310, 420], [340, 508, 1], [520, 476], [680, 480, 1], [725, 385], [770, 340], [840, 335], [920, 390], [952, 448]] },
    { pts: [[-10, 490], [150, 520], [300, 535], [520, 495], [705, 502, 1], [770, 430], [840, 425], [895, 465], [905, 502]] },
    { pts: [[-10, 520], [250, 555], [520, 518], [760, 540], [900, 525], [1000, 490], [1095, 462]] },
    { pts: [[-10, 628], [200, 598], [420, 565], [640, 548], [900, 545], [1095, 500]] },
    { pts: [[600, 815], [568, 720], [600, 645], [700, 600], [850, 572], [1000, 560], [1095, 565]] },
    { pts: [[-10, 722], [120, 690], [220, 692], [265, 740], [268, 815]] },
    { pts: [[1095, 600], [1042, 650], [1042, 690], [1095, 722]] },
    { pts: [[520, 35], [600, 95], [700, 130], [800, 160], [900, 190], [987, 225]] },
    { pts: [[740, 35], [800, 110], [880, 150], [968, 165]] },
    { closed: true, pts: [[825, 82], [870, 50], [925, 68], [915, 115], [850, 117]] },
    { pts: [[990, 35], [1006, 200], [1002, 330]] },
    { pts: [[1022, 35], [1034, 200], [1020, 320], [1095, 330]] },
    { pts: [[1055, 35], [1062, 180], [1095, 260]] },
  ],
  fronts: [
    { type: "warm", symbols: "left", pts: [[-10, 368], [80, 438], [160, 490], [250, 518]] },
    { type: "cold", symbols: "right", pts: [[250, 518], [350, 505], [430, 450], [470, 390], [487, 340]] },
    { type: "warm", symbols: "left", pts: [[487, 340], [535, 345], [580, 375], [630, 430], [668, 470], [720, 510], [770, 525]] },
    { type: "cold", symbols: "right", pts: [[770, 525], [830, 527], [900, 505], [950, 450], [985, 385], [990, 345]] },
    { type: "occluded", symbols: "right", pts: [[990, 345], [990, 240], [975, 150], [950, 80], [925, 35]] },
    { type: "warm", symbols: "left", pts: [[990, 345], [1020, 352], [1050, 395], [1090, 455]] },
  ],
  centres: [
    { type: "low", px: [487, 312] },
    { type: "low", px: [880, 85] },
    { type: "high", px: [135, 760] },
    { type: "high", px: [828, 660] },
  ],
  markers: [
    { label: "Q", style: "circle", px: [617, 355] },
    { label: "Z", style: "box", px: [652, 447] },
  ],
});

emit("050-surface-pressure-europe-050-048", {
  view: "western-europe",
  description: [
    "Surface pressure chart of western Europe. A deep low is centred over",
    "southern Ireland, ringed by closely spaced isobars. A short occlusion",
    "curls out of the centre to a triple point over south-west Britain. From",
    "there a cold front runs west-south-west across the Bay of Biscay, just",
    "north of Spain, into the Atlantic, and a warm front runs south-south-east",
    "across France to the Mediterranean coast, passing just west of Geneva",
    "(LSGG). The isobars in the warm sector between the two fronts are straight",
    "and parallel, running west to east. East of the warm front they turn",
    "north-east across Germany. A high lies east of the Alps and a",
    "second low is at the north-east corner of the chart.",
  ],
  landmarks: [
    { name: "geneva", geo: [6.1, 46.2], px: [542, 510] },
    { name: "sardinia", geo: [9, 40], px: [572, 670] },
    { name: "corsica", geo: [9, 42.1], px: [577, 612] },
    { name: "nw-iberia", geo: [-9, 43.3], px: [165, 590] },
    { name: "scotland-n", geo: [-4, 58.6], px: [395, 135] },
  ],
  isobars: [
    { closed: true, pts: [[285, 315], [320, 292], [355, 312], [322, 338]] },
    { closed: true, pts: [[250, 318], [290, 265], [350, 262], [395, 310], [370, 355], [300, 365]] },
    { pts: [[345, 428], [260, 400], [225, 330], [250, 255], [320, 222], [400, 248], [432, 320], [420, 400], [425, 432, 1], [345, 428]] },
    { pts: [[280, 468], [215, 420], [190, 330], [215, 235], [310, 190], [410, 215], [458, 290], [452, 390], [438, 462, 1], [280, 468]] },
    { pts: [[290, 30], [180, 150], [135, 280], [160, 400], [240, 492, 1], [350, 492], [452, 497, 1], [480, 420], [540, 310], [600, 230], [640, 150], [700, 90], [750, 30]] },
    { pts: [[200, 30], [110, 170], [80, 300], [110, 420], [185, 515, 1], [330, 520], [462, 525, 1], [520, 400], [600, 305], [700, 275], [800, 290], [975, 300]] },
    { pts: [[110, 30], [40, 200], [20, 330], [50, 450], [107, 537, 1], [300, 550], [470, 552, 1], [540, 445], [640, 355], [760, 345], [975, 370]] },
    { pts: [[-15, 470], [30, 530], [60, 546, 1], [250, 575], [482, 582, 1], [550, 540], [600, 470], [700, 415], [850, 410], [930, 450], [940, 560], [900, 640], [975, 695]] },
    { pts: [[-15, 620], [150, 640], [300, 655], [420, 640], [520, 660], [600, 590], [680, 600], [780, 660], [975, 760]] },
    { pts: [[-15, 705], [200, 718], [350, 720], [480, 730], [600, 745], [700, 720], [770, 815]] },
    { closed: true, pts: [[705, 505], [740, 472], [830, 470], [862, 505], [825, 540], [735, 537]] },
    { pts: [[770, 30], [790, 120], [850, 160], [975, 140]] },
    { pts: [[690, 30], [725, 150], [800, 215], [975, 230]] },
  ],
  fronts: [
    { type: "cold", symbols: "left", pts: [[403, 364], [330, 440], [240, 492, 1], [185, 515, 1], [107, 537, 1], [-15, 555]] },
    { type: "warm", symbols: "left", pts: [[403, 364], [435, 445], [467, 540], [500, 615]] },
    { type: "occluded", symbols: "right", pts: [[403, 364], [392, 335], [380, 305], [363, 295], [343, 291]] },
  ],
  centres: [
    { type: "low", px: [318, 315] },
    { type: "high", px: [783, 505] },
    { type: "low", px: [850, 95] },
  ],
  markers: [{ label: "LSGG", style: "dot", at: "geneva" }],
});
