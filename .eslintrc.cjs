/** @type { import("eslint").Linter.Config } */
module.exports = {
  overrides: [
    {
      files: ["*.js", "*.jsx", "*.ts", "*.tsx"],
      parserOptions: {
        sourceType: "module",
        ecmaVersion: "latest",
        project: "./tsconfig.json",
      },
      extends: ["love", "prettier"],
      plugins: ["prettier", "simple-import-sort"],
      rules: {
        "prettier/prettier": "warn",
        "simple-import-sort/imports": "warn",
        "simple-import-sort/exports": "warn",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/consistent-type-assertions": "off",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/no-unsafe-argument": "off",
        "@typescript-eslint/no-misused-promises": "off",
        "@typescript-eslint/naming-convention": "off",
      },
    },
  ],
};
