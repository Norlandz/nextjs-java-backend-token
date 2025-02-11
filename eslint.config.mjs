import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import typescriptEslintParser from '@typescript-eslint/parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type { import("eslint").Linter.Config[] } */ // https://github.com/typescript-eslint/typescript-eslint/issues/2153 // https://stackoverflow.com/questions/75684118/how-do-i-get-type-hints-for-eslints-new-config-file-eslint-config-js
const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs'],
    ignores: ['eslint.config.mjs'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        // tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest', // @todo
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
      // '@typescript-eslint',
      // 'react',
      // 'react-refresh',
    },
    rules: {
      // promise
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      'no-unused-expressions': 'off', // Note: you must disable the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-expressions': 'error',
      // ===
      eqeqeq: ['error', 'always', { null: 'ignore' }], // https://eslint.org/docs/latest/rules/eqeqeq
      // type cast
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'error',
      // @todo
      // react
      // 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/exhaustive-deps': 'warn',
      // warn
      'no-unused-vars': 'off', // Note: you must disable the base rule as it can report incorrect errors
      '@typescript-eslint/no-unused-vars': 'warn',
      'prefer-const': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      'no-empty': 'warn',
      'no-inner-declarations': 'off',
      'no-constant-condition': 'warn',
      '@typescript-eslint/no-duplicate-enum-values': 'warn',
      // warn
      '@typescript-eslint/no-this-alias': 'warn',
      // warn regex
      'no-useless-escape': 'warn',
      // warn misc comment
      '@typescript-eslint/ban-ts-comment': 'warn',
      'no-irregular-whitespace': 'warn',
    },
  },
];

export default eslintConfig;
