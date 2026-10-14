const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["dist/**"]
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node
      },
      sourceType: "commonjs"
    }
  }
];