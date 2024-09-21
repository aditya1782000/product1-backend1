/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+.tsx?$': ['ts-jest', {}],
    },
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1/test',
    },
    testTimeout: 3000,
    moduleDirectories: ['node_modules', 'src'],
    collectCoverage: true,
    coverageReporters: ['json', 'html']
};
