import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import eslintPluginVue from "eslint-plugin-vue";
import globals from "globals";

export default defineConfig(
  {
    ignores: [
      "*.d.ts",
      "**/coverage/**",
      "**/dist/**",
      "**/node_modules/**",
      "**/plop-templates/**",
      "**/.vue-global-types/**",
    ],
  },
  {
    extends: [
      eslint.configs.recommended,
      ...eslintPluginVue.configs["flat/essential"],
      ...eslintPluginVue.configs["flat/recommended"],
    ],
    files: ["**/*.{js,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "vue/multi-word-component-names": "off",
      "vue/no-v-html": "off",
      "vue/order-in-components": "error",
      "vue/attributes-order": "error",
    },
  },
);
