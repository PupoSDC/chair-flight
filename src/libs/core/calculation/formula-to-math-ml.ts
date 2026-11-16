import { parseFormula } from "./parse-formula.ts";
import type { FormulaNode } from "./parse-formula.ts";

const PRECEDENCE = { "+": 1, "-": 1, "*": 2, "/": 2, neg: 3, "^": 4 } as const;

const escapeXml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const formatNumber = (value: number) =>
  Number.isInteger(value) ? String(value) : String(Number(value.toFixed(6)));

const toRow = (
  node: FormulaNode,
  options: {
    values?: Record<string, number>;
    labels?: Record<string, string>;
  },
  parentPrecedence = 0,
  side: "left" | "right" | "none" = "none",
): string => {
  const wrap = (inner: string, precedence: number) =>
    precedence < parentPrecedence ||
    (precedence === parentPrecedence && side === "right" && precedence !== 4)
      ? `<mrow><mo>(</mo>${inner}<mo>)</mo></mrow>`
      : inner;

  switch (node.kind) {
    case "num":
      return `<mn>${formatNumber(node.value)}</mn>`;
    case "var": {
      const value =
        options.values && Object.hasOwn(options.values, node.name)
          ? options.values[node.name]
          : undefined;
      if (value !== undefined) return `<mn>${formatNumber(value)}</mn>`;
      const label = options.labels?.[node.name] ?? node.name;
      return `<mi mathvariant="normal">${escapeXml(label)}</mi>`;
    }
    case "neg":
      return wrap(
        `<mrow><mo>&#8722;</mo>${toRow(node.arg, options, PRECEDENCE.neg)}</mrow>`,
        PRECEDENCE.neg,
      );
    case "bin": {
      if (node.op === "/") {
        return `<mfrac>${toRow(node.left, options)}${toRow(node.right, options)}</mfrac>`;
      }
      if (node.op === "^") {
        const base = toRow(node.left, options, PRECEDENCE["^"] + 1);
        return `<msup>${base}${toRow(node.right, options)}</msup>`;
      }
      const precedence = PRECEDENCE[node.op];
      const symbol =
        node.op === "*" ? "&#215;" : node.op === "-" ? "&#8722;" : "+";
      const left = toRow(node.left, options, precedence, "left");
      const right = toRow(node.right, options, precedence, "right");
      return wrap(`<mrow>${left}<mo>${symbol}</mo>${right}</mrow>`, precedence);
    }
    case "call": {
      if (node.fn === "sqrt") {
        return `<msqrt>${toRow(node.args[0], options)}</msqrt>`;
      }
      if (node.fn === "abs") {
        return `<mrow><mo>|</mo>${toRow(node.args[0], options)}<mo>|</mo></mrow>`;
      }
      const args = node.args
        .map((arg) => toRow(arg, options))
        .join("<mo>,</mo>");
      return `<mrow><mi>${node.fn}</mi><mo>&#8289;</mo><mo>(</mo>${args}<mo>)</mo></mrow>`;
    }
  }
};

export const formulaToMathMl = (
  formula: FormulaNode | string,
  options: {
    values?: Record<string, number>;
    labels?: Record<string, string>;
  } = {},
) =>
  `<math display="inline">${toRow(
    typeof formula === "string" ? parseFormula(formula) : formula,
    options,
  )}</math>`;
