module.exports = {
    "root": true,
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": { "project": ["./tsconfig.json"] },
    "plugins": [
        "@typescript-eslint"
    ],
    "rules": {
        "@typescript-eslint/strict-boolean-expressions": "off",
      "indent": ["error", 2],
    },
    "ignorePatterns": ["src/**/*.test.ts", "src/frontend/generated/*"],
    "overrides": [
        {
            "files": ["*.ts", "*.tsx"],
            "rules": {
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }]
            }
        }
    ]
}
