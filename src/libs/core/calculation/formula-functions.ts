export const FORMULA_FUNCTIONS: Record<
  string,
  {
    arity: number | "variadic";
    run: (...args: number[]) => number;
  }
> = {
  sqrt: { arity: 1, run: Math.sqrt },
  abs: { arity: 1, run: Math.abs },
  round: { arity: 1, run: Math.round },
  floor: { arity: 1, run: Math.floor },
  ceil: { arity: 1, run: Math.ceil },
  ln: { arity: 1, run: Math.log },
  log10: { arity: 1, run: Math.log10 },
  exp: { arity: 1, run: Math.exp },
  sin: { arity: 1, run: (x) => Math.sin((x * Math.PI) / 180) },
  cos: { arity: 1, run: (x) => Math.cos((x * Math.PI) / 180) },
  tan: { arity: 1, run: (x) => Math.tan((x * Math.PI) / 180) },
  asin: { arity: 1, run: (x) => (Math.asin(x) * 180) / Math.PI },
  acos: { arity: 1, run: (x) => (Math.acos(x) * 180) / Math.PI },
  atan: { arity: 1, run: (x) => (Math.atan(x) * 180) / Math.PI },
  atan2: { arity: 2, run: (y, x) => (Math.atan2(y, x) * 180) / Math.PI },
  min: { arity: "variadic", run: Math.min },
  max: { arity: "variadic", run: Math.max },
};
