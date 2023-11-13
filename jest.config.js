/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts$': ['ts-jest', {tsconfig: {verbatimModuleSyntax: false}}],
    },
    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
};
