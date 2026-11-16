import { FORMULA_FUNCTIONS } from "./formula-functions.ts";
import { parseFormula } from "./parse-formula.ts";
import type { FormulaNode } from "./parse-formula.ts";

const evaluateNode = (
  node: FormulaNode,
  values: Record<string, number>,
): number => {
  switch (node.kind) {
    case "num":
      return node.value;
    case "var": {
      const value = Object.hasOwn(values, node.name)
        ? values[node.name]
        : undefined;
      if (typeof value !== "number") {
        throw new Error(`Missing value for "${node.name}"`);
      }
      return value;
    }
    case "neg":
      return -evaluateNode(node.arg, values);
    case "bin": {
      const left = evaluateNode(node.left, values);
      const right = evaluateNode(node.right, values);
      if (node.op === "+") return left + right;
      if (node.op === "-") return left - right;
      if (node.op === "*") return left * right;
      if (node.op === "/") return left / right;
      return left ** right;
    }
    case "call":
      return FORMULA_FUNCTIONS[node.fn].run(
        ...node.args.map((arg) => evaluateNode(arg, values)),
      );
  }
};

export const evaluateFormula = (
  formula: FormulaNode | string,
  values: Record<string, number>,
) =>
  evaluateNode(
    typeof formula === "string" ? parseFormula(formula) : formula,
    values,
  );
