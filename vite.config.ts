import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { type BuildEnvironmentOptions, defineConfig } from "vite";

const IGNORED_WARNINGS = new Set([
	"MODULE_LEVEL_DIRECTIVE",
	"MISSING_CODE_SPLITTING_GROUP_DEBUG_NAME",
]);

const onLog: NonNullable<
	NonNullable<BuildEnvironmentOptions["rolldownOptions"]>["onLog"]
> = (level, log, defaultHandler) => {
	if (level === "warn" && IGNORED_WARNINGS.has(log.code ?? "")) return;
	defaultHandler(level, log);
};

export default defineConfig({
	resolve: { tsconfigPaths: true },
	server: { port: 3100, strictPort: true },
	preview: { port: 3100, strictPort: false },
	build: { rolldownOptions: { onLog } },
	environments: { nitro: { build: { rolldownOptions: { onLog } } } },
	plugins: [
		tailwindcss(),
		tanstackStart({ prerender: { enabled: true, crawlLinks: false } }),
		nitro(),
		viteReact(),
	],
});
