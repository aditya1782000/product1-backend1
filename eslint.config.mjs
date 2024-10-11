import globals from 'globals';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';

export default [
    { files: ['**/*.{js,mjs,cjs,ts}'] },
    { languageOptions: { parser: tsParser, globals: globals.browser } },
    ...tseslint.configs.recommended,
    {
        ignores: [
            // ignore files explicitly in config as a backup
            'src/app.ts',
            'src/index.ts',
            'src/utils/kafka.ts',
            'src/utils/socket.ts',
        ],
    },
    {
        rules: {
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    flatTernaryExpressions: true,
                    ignoredNodes: ['ConditionalExpression'],
                },
            ],

            'no-console': [
                'error',
                {
                    allow: ['warn', 'error'],
                },
            ],
        },
    },
];
