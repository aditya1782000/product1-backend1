/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/test/index.ts'],
    setupFilesAfterEnv: ['<rootDir>/src/test/index.ts'],
    testTimeout: 30000,
    moduleDirectories: ['node_modules', 'src'],
    collectCoverage: true,
    coverageReporters: ['json', 'html'],
};
