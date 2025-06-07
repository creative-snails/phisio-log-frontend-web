import js from "@eslint/js";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettier from "eslint-plugin-prettier";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "node_modules",
      "dist",
      "dist-ssr",
      "*.local",
      "logs",
      "*.log",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "lerna-debug.log*",
      ".vscode/*",
      ".idea",
      ".DS_Store",
      "*.suo",
      "*.ntvs*",
      "*.njsproj",
      "*.sln",
      "*.sw?",
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    // Plugins registrations
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      prettier: prettier,
      react: react,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      // Enforce absolute imports over relative
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "../*/*", "../../*"],
              message: "Please use absolute paths with the ~ prefix instead of relative parent paths.",
            },
          ],
        },
      ],
      // Apply React Hooks recommendations
      ...reactHooks.configs.recommended.rules,
      // Warn on non-component exports and permit constant exports
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      // Enforce blank lines between statements
      "padding-line-between-statements": ["error", { blankLine: "always", prev: "*", next: "return" }],
      // Import sorting config
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            [
              "^react", // React-related packages first
              "^@?\\w", // Third-party packages
              "^\\.\\.(?!/?$)", // Parent imports
              "^\\.\\./?$", // Parent folder index
              "^\\./(?=.*/)(?!/?$)", // Nested relative imports
              "^\\.(?!/?$)", // Current folder imports
              "^\\./?$", // Current folder index
            ],
          ],
        },
      ],
      // React-specific rules
      "react-hooks/rules-of-hooks": ["error"],
      "react-hooks/exhaustive-deps": "off",
      "react/jsx-key": ["error"],
      "react/jsx-tag-spacing": [
        "error",
        {
          closingSlash: "never",
          beforeSelfClosing: "always",
          afterOpening: "never",
          beforeClosing: "allow",
        },
      ],
      "prettier/prettier": "error",
    },
    // Plugin settings
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
