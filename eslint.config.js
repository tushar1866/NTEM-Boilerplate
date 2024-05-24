const { ESLint } = require('eslint');
const prettier = require('eslint-plugin-prettier');
const typescriptEslintParser = require('@typescript-eslint/parser');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
module.exports = [
    {
        files: ['**/*.ts'],
        languageOptions: {
            parser: typescriptEslintParser,
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslintPlugin,
            prettier: prettier,
        },
        rules: {
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': [
                'error',
                { argsIgnorePattern: '^_' },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'no-console': 'warn',
            'no-var': 'error',
            'prefer-const': 'error',
        },
    },
];

// "module": "commonjs",
// "esModuleInterop": true,
// "target": "ES2020",
// "noImplicitAny": true,
// "moduleResolution": "node",
// "resolveJsonModule": true,
// "outDir": "dist",
// "rootDir": "src"
