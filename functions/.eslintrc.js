module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "google",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json", "tsconfig.dev.json"],
    sourceType: "module",
  },
  ignorePatterns: [
    "/lib/**/*", // Ignore built files.
    "/src/@customTypes/graphql-types.d.ts",
  ],
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  rules: {
    "quotes": ["error", "double"],
    "object-curly-spacing": 0,
    "indent": "off",
    "max-len": "off",
    "import/no-named-as-default-member": "off",
    "new-cap": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "operator-linebreak": "off",
    "@typescript-eslint/prefer-as-const": "off",
    // while in dev
    // "no-unused-vars": 0,
    // "@typescript-eslint/no-unused-vars": ["off"],
    // "noUnusedLocals": false,
  },
  settings: {
    "import/resolver": {
      "eslint-import-resolver-typescript": {},
    },
  },
};
