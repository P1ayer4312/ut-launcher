import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      react: pluginReact,
    },
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: { "react/react-in-jsx-scope": "off", "no-console": ["warn"] },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "script" },
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  {
    ignores: ["node_modules/*", ".vite/*", "dist/*"],
  },
);
