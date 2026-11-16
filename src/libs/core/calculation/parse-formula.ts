import { FORMULA_FUNCTIONS } from "./formula-functions.ts";
export type FormulaNode =
  | {
      kind: "num";
      value: number;
    }
  | {
      kind: "var";
      name: string;
    }
  | {
      kind: "neg";
      arg: FormulaNode;
    }
  | {
      kind: "bin";
      op: "+" | "-" | "*" | "/" | "^";
      left: FormulaNode;
      right: FormulaNode;
    }
  | {
      kind: "call";
      fn: string;
      args: FormulaNode[];
    };

const CONSTANTS: Record<string, number> = { pi: Math.PI };

const TOKEN_PATTERN =
  /\s*(?:(\d+(?:\.\d+)?|\.\d+)|([A-Za-z_][A-Za-z0-9_]*)|([-+*/^(),]))/y;

const tokenize = (source: string) => {
  const tokens: { type: "num" | "id" | "op"; text: string; pos: number }[] = [];
  let position = 0;
  while (position < source.length && source.slice(position).trim() !== "") {
    TOKEN_PATTERN.lastIndex = position;
    const match = TOKEN_PATTERN.exec(source);
    if (!match) {
      throw new Error(`Unexpected character at ${position} in "${source}"`);
    }
    const text = match[1] ?? match[2] ?? match[3];
    const type = match[1] !== undefined ? "num" : match[2] ? "id" : "op";
    tokens.push({ type, text, pos: TOKEN_PATTERN.lastIndex - text.length });
    position = TOKEN_PATTERN.lastIndex;
  }
  return tokens;
};

export const parseFormula = (source: string): FormulaNode => {
  const tokens = tokenize(source);
  const cursor = { index: 0 };
  const peek = () => tokens[cursor.index];
  const eat = (text?: string) => {
    const token = tokens[cursor.index];
    if (!token || (text !== undefined && token.text !== text)) {
      throw new Error(
        `Expected ${text ?? "token"} at ${token?.pos ?? source.length} in "${source}"`,
      );
    }
    cursor.index++;
    return token;
  };

  const parseSum = (): FormulaNode => {
    const node = { current: parseProduct() };
    while (peek()?.text === "+" || peek()?.text === "-") {
      const op = eat().text as "+" | "-";
      node.current = {
        kind: "bin",
        op,
        left: node.current,
        right: parseProduct(),
      };
    }
    return node.current;
  };

  const parseProduct = (): FormulaNode => {
    const node = { current: parseUnary() };
    while (peek()?.text === "*" || peek()?.text === "/") {
      const op = eat().text as "*" | "/";
      node.current = {
        kind: "bin",
        op,
        left: node.current,
        right: parseUnary(),
      };
    }
    return node.current;
  };

  const parseUnary = (): FormulaNode => {
    if (peek()?.text === "-") {
      eat();
      return { kind: "neg", arg: parseUnary() };
    }
    return parsePower();
  };

  const parsePower = (): FormulaNode => {
    const base = parseAtom();
    if (peek()?.text !== "^") return base;
    eat();
    return { kind: "bin", op: "^", left: base, right: parseUnary() };
  };

  const parseCall = (name: string): FormulaNode => {
    const fn = Object.hasOwn(FORMULA_FUNCTIONS, name)
      ? FORMULA_FUNCTIONS[name]
      : undefined;
    if (!fn) throw new Error(`Unknown function "${name}" in "${source}"`);
    eat("(");
    const args = [parseSum()];
    while (peek()?.text === ",") {
      eat(",");
      args.push(parseSum());
    }
    eat(")");
    if (fn.arity !== "variadic" && fn.arity !== args.length) {
      throw new Error(`${name}() takes ${fn.arity} argument(s) in "${source}"`);
    }
    return { kind: "call", fn: name, args };
  };

  const parseAtom = (): FormulaNode => {
    const token = peek();
    if (!token) throw new Error(`Unexpected end of "${source}"`);
    if (token.type === "num") {
      eat();
      return { kind: "num", value: Number(token.text) };
    }
    if (token.type === "id") {
      eat();
      if (peek()?.text === "(") return parseCall(token.text);
      if (Object.hasOwn(CONSTANTS, token.text)) {
        return { kind: "num", value: CONSTANTS[token.text] };
      }
      return { kind: "var", name: token.text };
    }
    if (token.text === "(") {
      eat("(");
      const inner = parseSum();
      eat(")");
      return inner;
    }
    throw new Error(
      `Unexpected "${token.text}" at ${token.pos} in "${source}"`,
    );
  };

  const ast = parseSum();
  if (cursor.index < tokens.length) {
    const token = tokens[cursor.index];
    throw new Error(
      `Unexpected "${token.text}" at ${token.pos} in "${source}"`,
    );
  }
  return ast;
};
