const path = require("path");

module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      env: {
        node: true,
        jest: true
      },
      files: [
        ".eslintrc.{js,cjs}",
        path.resolve(__dirname, "tests/**/*.test.js"),
        path.resolve(__dirname, "tests/setup/**/*.js")
      ],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-unused-vars": [
      'warn',
      {
        vars: 'all',
        args: 'none',
      }
    ]
  },
};
