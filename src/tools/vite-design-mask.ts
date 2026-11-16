import type { Plugin } from "vite";

export const designMaskPlugin = (): Plugin => ({
  name: "chair-flight-design-mask",
  apply: "serve",
  transform(code, id) {
    if (!id.includes("/libs/ui/components/") || !id.endsWith(".tsx")) return;
    const names = Array.from(
      code.matchAll(/export const ([A-Z]\w*)\s*[:=]/g),
      (match) => match[1],
    );
    if (!names.length) return;
    return {
      code: `${code}\nimport { registerDesignComponent } from
        "/src/tools/design-mask/component-registry.ts";\n${names
          .map((name) => `registerDesignComponent("${name}", ${name});`)
          .join("\n")}`,
      map: null,
    };
  },
});
