import { test, expect } from '@fixtures/baseTest';
import { RunDetailPage } from '@pages/run-detail.page';
import { type RunStatus } from '@pages/dashboard.page';

const ACCENT_RGB = 'rgb(79, 70, 229)'; // #4F46E5
const WHITE_RGB = 'rgb(255, 255, 255)';

// Seeded run per status (apps/api/src/seed.ts) with the filled color of its badge.
const BADGES: { run: string; status: RunStatus; background: string }[] = [
    { run: 'Inventory Sync', status: 'queued', background: 'rgb(71, 85, 105)' }, // #475569
    { run: 'Profile Settings', status: 'running', background: 'rgb(29, 78, 216)' }, // #1D4ED8
    { run: 'Checkout Regression', status: 'passed', background: 'rgb(21, 128, 61)' }, // #15803D
    { run: 'Search Indexing', status: 'failed', background: 'rgb(185, 28, 28)' }, // #B91C1C
];

test.describe('modern UI', { tag: '@regression' }, () => {
    // E1 (FR2.1, FR1.2)
    test('the indigo header holds a level-1 title that links home', { tag: '@post-deploy' }, async ({ page, dashboardPage }) => {
        const title = page.getByRole('heading', { level: 1, name: 'Release Quality Dashboard' });
        await expect(title).toBeVisible();
        await expect(title.getByRole('link', { name: 'Release Quality Dashboard' })).toHaveAttribute('href', '#/');
        await expect(dashboardPage.homeLink).toHaveCount(1);
        await expect(page.getByRole('banner')).toHaveCSS('background-color', ACCENT_RGB);
    });

    // E2 (FR4.1, FR4.2, FR1.3)
    test('status badges show the lowercase status, a hidden icon and a filled status color', async ({ dashboardPage }) => {
        for (const { run, status, background } of BADGES) {
            const badge = dashboardPage.runsTable.getCell('Status', run, 'Name').getByTestId('status-badge');
            await expect(badge, `${run} badge text`).toHaveText(status);
            await expect(badge.locator('svg'), `${run} badge icon`).toHaveAttribute('aria-hidden', 'true');
            await expect(badge, `${run} badge background`).toHaveCSS('background-color', background);
            await expect(badge, `${run} badge text color`).toHaveCSS('color', WHITE_RGB);
        }
    });

    // E3 (FR7.1, FR7.2, FR5.1)
    test('durations and dates are readable in the list and on the detail page', async ({ page, dashboardPage }) => {
        const { runsTable } = dashboardPage;
        await expect(runsTable.getCell('Duration', 'Checkout Regression', 'Name')).toHaveText('5m 12s');

        await runsTable.clickCell('Name', 'Checkout Regression');
        const detailPage = new RunDetailPage(page);
        await expect(detailPage.heading).toHaveText('Checkout Regression');

        const valueFor = (label: string) =>
            page.locator('dt').filter({ hasText: new RegExp(`^${label}$`) }).locator('xpath=following-sibling::dd[1]');
        await expect(valueFor('Duration')).toHaveText('5m 12s');
        const created = valueFor('Created');
        await expect(created).toContainText('2026');
        await expect(created).not.toHaveText('2026-01-05T09:00:00.000Z');
        await expect(created).not.toContainText('T09:00');
    });

    // E4 (FR5.3, BR5.1)
    test('a missing run shows a not-found alert and the back link', async ({ page }) => {
        await page.goto('/#/runs/999999');
        await expect(page.getByRole('alert')).toHaveText('Run not found.');
        await expect(page.getByRole('link', { name: 'Back to runs' })).toBeVisible();
        await expect(page.locator('#detail-heading')).toHaveCount(0);
    });

    // E5 (FR2.3, BR2.3)
    test('on a 375px screen the page does not scroll sideways but the table does', async ({ page, dashboardPage }) => {
        await page.setViewportSize({ width: 375, height: 800 });
        await dashboardPage.goto();
        await expect(dashboardPage.rows).toHaveCount(9);

        const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(pageOverflow, 'page horizontal overflow (px)').toBeLessThanOrEqual(0);

        const tableOverflow = await page
            .getByTestId('run-list-table-container')
            .evaluate((container) => container.scrollWidth - container.clientWidth);
        expect(tableOverflow, 'table container horizontal overflow (px)').toBeGreaterThan(0);

        // Filters stack: the Status filter sits below the search field.
        const searchBox = await dashboardPage.searchInput.boundingBox();
        const statusBox = await dashboardPage.statusFilter.boundingBox();
        expect(searchBox && statusBox && statusBox.y >= searchBox.y + searchBox.height, 'Status is stacked under Search runs').toBe(true);
    });

    // E6 (NFR3, BR1.5)
    test('keyboard focus shows a 2px solid accent outline', async ({ page, dashboardPage }) => {
        await dashboardPage.homeLink.focus();
        await page.keyboard.press('Tab');
        await expect(dashboardPage.searchInput).toBeFocused();
        // Text fields draw the ring on the outlined input root around the native input.
        const searchRoot = dashboardPage.searchInput.locator(
            'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " MuiOutlinedInput-root ")][1]',
        );
        await expect(searchRoot).toHaveCSS('outline-style', 'solid');
        await expect(searchRoot).toHaveCSS('outline-width', '2px');
        await expect(searchRoot).toHaveCSS('outline-color', ACCENT_RGB);

        await dashboardPage.notesInput.focus();
        await page.keyboard.press('Tab');
        await expect(dashboardPage.createRunButton).toBeFocused();
        await expect(dashboardPage.createRunButton).toHaveCSS('outline-style', 'solid');
        await expect(dashboardPage.createRunButton).toHaveCSS('outline-width', '2px');
        await expect(dashboardPage.createRunButton).toHaveCSS('outline-color', ACCENT_RGB);
    });
});
