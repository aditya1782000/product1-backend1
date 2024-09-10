import globals from 'globals';

export default [
    {
        files: ["src/**/*.ts"],
        languageOptions: {
            ecmaVersion: 12,
            sourceType: 'module',
        },

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

            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],

            'max-len': [
                'error',
                {
                    code: 80,
                    ignoreUrls: true,
                    ignoreStrings: true,
                    ignoreComments: true,
                    ignoreRegExpLiterals: true,
                    ignoreTemplateLiterals: true,
                    ignoreTrailingComments: true,
                },
            ],

            'no-unused-vars': [
                'error',
                {
                    args: 'none',
                    caughtErrors: 'none',
                },
            ],

            'no-cond-assign': ['error', 'always'],
            'no-multi-spaces': 'error',
            'no-throw-literal': 'error',
            'block-spacing': 'error',
            'brace-style': 'error',

            camelcase: [
                'error',
                {
                    properties: 'never',
                    ignoreDestructuring: true,
                    ignoreImports: true,
                    ignoreGlobals: true,
                },
            ],

            'comma-spacing': [
                'error',
                {
                    before: false,
                    after: true,
                },
            ],

            'comma-style': ['error', 'last'],
            'func-call-spacing': ['error', 'never'],

            'key-spacing': [
                'error',
                {
                    beforeColon: false,
                    afterColon: true,
                },
            ],

            'keyword-spacing': [
                'error',
                {
                    overrides: {
                        if: {
                            after: true,
                        },

                        for: {
                            after: true,
                        },

                        while: {
                            after: true,
                        },

                        static: {
                            after: true,
                        },

                        as: {
                            after: true,
                        },
                    },
                },
            ],

            'no-multiple-empty-lines': [
                'error',
                {
                    max: 2,
                    maxBOF: 1,
                },
            ],

            'space-before-function-paren': [
                'error',
                {
                    anonymous: 'always',
                    named: 'never',
                    asyncArrow: 'always',
                },
            ],

            'no-var': 'error',

            'prefer-const': [
                'error',
                {
                    destructuring: 'all',
                },
            ],

            'no-dupe-args': 'error',
            'no-dupe-keys': 'error',
            'for-direction': 'error',
            'no-const-assign': 'error',
            'no-debugger': 'error',
            'no-dupe-else-if': 'error',
            'no-duplicate-case': 'error',
            'no-ex-assign': 'error',
            'no-extra-boolean-cast': 'error',
            'no-extra-semi': 'error',
            'no-fallthrough': 'error',
            'no-obj-calls': 'error',
            'no-shadow-restricted-names': 'error',
            'no-sparse-arrays': 'error',
            'no-undef': 'error',
            'no-unreachable': 'error',
            'no-unsafe-finally': 'error',
            'use-isnan': 'error',
            'valid-typeof': 'error',

            'no-console': [
                'error',
                {
                    allow: ['warn', 'error'],
                },
            ],
        },
    },
];
