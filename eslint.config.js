import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser, // for Canvas/DOM
        ...globals.node,    // for Jest/Node
        ...globals.jest     // to avoid errors on 'tests' and 'expect'
      },
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off", // We need console.warn
      "semi": ["error", "always"],
      "quotes": ["error", "single"]
    }
  }
];
