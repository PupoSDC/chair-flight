import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { type BuildEnvironmentOptions, defineConfig } from "vite";
import { contentAssetsPlugin } from "./src/tools/vite-content-assets.ts";
import { designMaskPlugin } from "./src/tools/vite-design-mask.ts";
import { impersonatePlugin } from "./src/tools/vite-impersonate.ts";

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
	// Env files are loaded by the package.json scripts (`node --env-file`), so
	// `pnpm dev` never picks up `.env.local` behind our back.
	envDir: false,
	define: {
		"import.meta.env.FEATURE_FLAG_USER_FLOW": JSON.stringify(
			process.env.FEATURE_FLAG_USER_FLOW === "true" ? "true" : "false",
		),
		"import.meta.env.SUPABASE_URL": JSON.stringify(
			process.env.SUPABASE_URL ?? "",
		),
		"import.meta.env.SUPABASE_PUBLISHABLE_KEY": JSON.stringify(
			process.env.SUPABASE_PUBLISHABLE_KEY ?? "",
		),
	},
	server: { port: 3100, strictPort: true },
	preview: { port: 3100, strictPort: false },
	build: { rolldownOptions: { onLog } },
	environments: { nitro: { build: { rolldownOptions: { onLog } } } },
	plugins: [
		impersonatePlugin(),
		contentAssetsPlugin(),
		designMaskPlugin(),
		tailwindcss(),
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: false,
				concurrency: 1,
				// The back office is an admin-only page: nothing to prerender.
				filter: ({ path }) => !path.startsWith("/backoffice"),
			},
		}),
		nitro(),
		viteReact(),
	],
});
