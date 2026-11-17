import { evaluateFormula } from "./evaluate-formula.ts";
import { formulaToMathMl } from "./formula-to-math-ml.ts";

export const fillTemplate = (
  text: string,
  context: {
    values: Record<string, number>;
    labels?: Record<string, string>;
    results?: Record<string, number>;
    decimals?: number;
    formatResult?: (value: number) => string;
  },
) => {
  const decimals = context.decimals ?? 2;
  const all = { ...context.values, ...context.results };
  const formatPlain = (value: number) =>
    String(Number(value.toFixed(decimals)));

  return text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, raw: string) => {
    if (raw.startsWith("=")) {
      return formatPlain(evaluateFormula(raw.slice(1), all));
    }
    if (raw.startsWith("pick:")) {
      const [name, ...choices] = raw
        .slice(5)
        .split("|")
        .map((x) => x.trim());
      if (!Object.hasOwn(all, name)) {
        throw new Error(`Unknown placeholder "${name}"`);
      }
      return choices[Math.round(all[name])] ?? "";
    }
    if (raw.startsWith("pad:")) {
      const name = raw.slice(4).trim();
      if (!Object.hasOwn(all, name)) {
        throw new Error(`Unknown placeholder "${name}"`);
      }
      return String(Math.round(all[name])).padStart(3, "0");
    }
    if (raw.startsWith("f:")) {
      return formulaToMathMl(raw.slice(2), { labels: context.labels });
    }
    if (raw.startsWith("n:")) {
      return formulaToMathMl(raw.slice(2), { values: all });
    }
    if (!Object.hasOwn(all, raw)) {
      throw new Error(`Unknown placeholder "${raw}"`);
    }
    const isResult = context.results && Object.hasOwn(context.results, raw);
    if (isResult && context.formatResult) return context.formatResult(all[raw]);
    if (!isResult) return String(Number(all[raw].toFixed(10)));
    return formatPlain(all[raw]);
  });
};
