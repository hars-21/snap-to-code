import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";
import { config as baseConfig } from "./base.js";

/**
 * ESLint configuration for Vite + React applications.
 * @type {import("eslint").Linter.Config[]}
 */
export const config = [
	...baseConfig,
	pluginReact.configs.flat.recommended,
	{
		languageOptions: {
			...pluginReact.configs.flat.recommended.languageOptions,
			globals: {
				...globals.browser,
			},
		},
	},
	{
		plugins: {
			"react-hooks": pluginReactHooks,
			"react-refresh": pluginReactRefresh,
		},
		settings: { react: { version: "detect" } },
		rules: {
			...pluginReactHooks.configs.recommended.rules,
			"react/react-in-jsx-scope": "off",
			"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		},
	},
];
