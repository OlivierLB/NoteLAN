import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig(
  globalIgnores([
    "node_modules",
    ".test-build",
    "main.js",
    "esbuild.config.mjs",
    "scripts",
    "tests",
  ]),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        Buffer: "readonly",
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mjs", "manifest.json"],
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: [".json"],
      },
    },
  },
  ...obsidianmd.configs.recommended,
  {
    files: ["src/**/*.ts"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-misused-promises": "warn",
      "@typescript-eslint/no-unsafe-argument": "warn",
      "@typescript-eslint/no-unsafe-assignment": "warn",
      "@typescript-eslint/no-unsafe-call": "warn",
      "@typescript-eslint/no-unsafe-member-access": "warn",
      "@typescript-eslint/no-unsafe-return": "warn",
      "@typescript-eslint/no-deprecated": "warn",
    },
  },
);
