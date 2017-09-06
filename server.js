import {Meteor} from 'meteor/meteor';

import {mocha} from './lib/mocha';
import {createBrowser} from './lib/puppeteer';

// Export mocha functions (describe, it etc.) and other public api
export * from './lib/mocha';
export * from './lib/chai';
export * from './lib/puppeteer';

// Export puppeteer objects that will be initialized later
export let browser = null;
export let page = null;

// Allow easier context checking
Meteor.isE2E = true;

// Start is a hidden Meteor test-driver API
export function start () {
    Meteor.startup(async () => {
        // Launch a browser instance
        browser = await createBrowser();

        // Create a page instance to be ready to use by the user
        page = await browser.newPage();
        await page.goto(Meteor.absoluteUrl());

        // Perform cleanup if Meteor server restarts while the tests are running
        const cleanup = async () => {
            // Closes browser with all the pages
            await browser.close();

            console.info('[universe:e2e] Meteor server restart detected, interrupting ongoing tests...');

            // Actually stop the Meteor process
            process.exit(0);
        };

        // Since Meteor doesn't provide any exit hook, listening for SIGTERM is best what we can do
        process.once('SIGTERM', cleanup);

        // Run the tests using Mocha
        mocha.run(async errorCount => {
            // Gracefully close browser with all the pages after tests
            try {
                await browser.close();
            } catch (e) {
                console.error(`[universe:e2e] Cannot close browser: ${e.message}`);
            }

            // We don't need to stop services on server restart anymore
            process.removeListener('SIGTERM', cleanup);

            // In CI mode we stop Meteor, otherwise (watch mode) we leave it as is
            if (process.env.CI) {
                process.exit(errorCount > 0 ? 1 : 0);
            }
        });
    });
}
