import {Meteor} from 'meteor/meteor';

import {mocha} from './lib/mocha';
import {browser} from './lib/webdriverio';
import {spawnSelenium} from './lib/selenium';

// Export mocha functions (describe, it etc.) and other public api
export * from './lib/mocha';
export * from './lib/chai';
export {browser};

// Allow easier context checking
Meteor.isE2E = true;

// Start is a hidden Meteor test-driver API
export function start () {
    Meteor.startup(async () => {
        // Start Selenium (this will log errors internally)
        const selenium = await spawnSelenium();

        // Perform cleanup if Meteor server restarts while the tests are running
        const cleanup = async () => {
            // Close all browser windows
            await browser.endAll().catch(() => {/* It could fail, it's ok :) */});

            // Stop selenium server
            selenium.kill();

            console.info('[universe:e2e] Meteor server restart detected, interrupting ongoing tests...');

            // Actually stop the Meteor process
            process.exit(0);
        };

        // Since Meteor doesn't provide any exit hook, listening for SIGTERM is best what we can do
        process.once('SIGTERM', cleanup);

        try {
            // Start and wait until the browser is ready
            await browser.init();
        } catch (e) {
            // Re-throw to prevent further execution
            console.error(`[universe:e2e] Cannot init WebdriverIO session: ${e.message}`);
            throw e;
        }

        // Run the tests using Mocha
        mocha.run(async errorCount => {

            // Gracefully stop WebDriverIO and Selenium
            try {
                await browser.endAll();
            } catch (e) {
                console.error(`[universe:e2e] Cannot close WebdriverIO sessions: ${e.message}`);
            }

            try {
                selenium.kill();
            } catch (e) {
                console.error(`[universe:e2e] Cannot stop Selenium process: ${e.message}`);
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

