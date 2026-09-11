/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts$': ['ts-jest'],
    },
    globalSetup: '<rootDir>/jest.global-setup.js',
    setupFilesAfterEnv: ['<rootDir>/setup-tests.ts'],
};
