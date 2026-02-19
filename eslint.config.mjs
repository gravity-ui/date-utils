import baseConfig from '@gravity-ui/eslint-config';
import importOrderConfig from '@gravity-ui/eslint-config/import-order';
import prettierConfig from '@gravity-ui/eslint-config/prettier';
import {defineConfig, globalIgnores} from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    baseConfig,
    prettierConfig,
    importOrderConfig,
    {
        rules: {
            complexity: 'off',
            'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
        },
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        rules: {
            '@typescript-eslint/prefer-ts-expect-error': 'error',
            '@typescript-eslint/consistent-type-imports': [
                'error',
                {prefer: 'type-imports', fixStyle: 'separate-type-imports'},
            ],
        },
    },
    {
        files: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
        rules: {'no-console': 'off'},
        languageOptions: {globals: {...globals.jest}},
    },
    {files: ['**/*.js', '!src/**/*'], languageOptions: {globals: {...globals.node}}},
    globalIgnores(['build']),
]);
