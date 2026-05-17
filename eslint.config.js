import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import {defineConfig} from "eslint/config";

export default defineConfig([
    {
        ignores: ["dist/**", "coverage/**", "test-results/**"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            }
        }
    },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooks
        },

        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,

            "react/react-in-jsx-scope": "off",
            "react/prop-types": "off"
        },

        settings: {
            react: {
                version: "detect"
            }
        }
    }
]);
