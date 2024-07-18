import type { Config } from '@jest/types';
const config: Config.InitialOptions = {
    testEnvironment: 'node',
    testEnvironmentOptions: {
        NODE_ENV: 'test',
    },
    restoreMocks: true,
    coveragePathIgnorePatterns: [
        'node_modules',
        'src/config',
        'src/app.js',
        'tests',
    ],
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
};
export default config;
