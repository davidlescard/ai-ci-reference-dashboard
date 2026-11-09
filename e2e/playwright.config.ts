import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    reporter: [
        ['list'],
        ['html', { open: 'never' }],
        ['junit', { outputFile: process.env.PLAYWRIGHT_JUNIT_OUTPUT_FILE ?? 'test-results/junit.xml' }]
    ],
    use: {
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'ui',
            testDir: './tests/ui',
            use: {...devices['Desktop Chrome']}
        },
        {
            name: 'api',
            testDir: './tests/api',
        },
        {
            // Pure-module unit tests (apps/web formatting and design tokens): no browser, no app server.
            name: 'unit',
            testDir: './tests/unit',
        }
    ],
})