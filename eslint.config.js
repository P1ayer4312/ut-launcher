import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default [
	{ ignores: ["dist", "node_modules", "public", "build"] },
	{
		files: ["**/*.{js,jsx,cjs}"],
		languageOptions: {
			ecmaVersion: 2020,
			globals: { ...globals.browser, process: "readonly", __dirname: "readonly" },
			parserOptions: {
				ecmaVersion: "latest",
				ecmaFeatures: { jsx: true },
				sourceType: "module",
			},
		},
		plugins: {
			"react-hooks": reactHooks,
			"react-refresh": reactRefresh,
		},
		rules: {
			...js.configs.recommended.rules,
			...reactHooks.configs.recommended.rules,
			"no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
			"no-console": ["warn"],
		},
	},
	...pluginQuery.configs["flat/recommended"],
];
