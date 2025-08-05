import { fixupPluginRules } from "@eslint/compat";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import _import from "eslint-plugin-import";
import n from "eslint-plugin-n";
import promise from "eslint-plugin-promise";
import unusedImports from "eslint-plugin-unused-imports";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    languageOptions: { globals: globals.node },
  },
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended,
  globalIgnores([
    "**/node_modules",
    "**/build",
    "**/.gitignore",
    "**/.env",
    "**/dist",
    "src/migrations",
    "scripts",
  ]),
  {
    files: ["src/**/*.{js,mjs,cjs,ts}"],
    plugins: {
      import: fixupPluginRules(_import),
      n,
      promise: fixupPluginRules(promise),
      "unused-imports": unusedImports,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",

      parserOptions: {
        project: ["./tsconfig.json"],

        ecmaFeatures: {
          jsx: true,
          tsx: true,
        },
      },
    },

    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    },

    rules: {
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/lines-between-class-members": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: false,
        },
      ],

      "implicit-arrow-linebreak": "off",
      "no-await-in-loop": "off",
      "class-methods-use-this": "off",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-throw-literal": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "import/prefer-default-export": "off",
      "import/no-cycle": "off",

      "no-useless-return": "off",
      "no-bitwise": "off",
      "no-underscore-dangle": "off",
      "max-classes-per-file": "off",
      "no-restricted-imports": "off",
      "no-restricted-syntax": [
        "off",
        {
          selector: "ForOfStatement",
          message: "For-of loops are allowed.",
        },
      ],
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        {
          vars: "all",
          varsIgnorePattern: "^_",
          args: "after-used",
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
