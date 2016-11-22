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

        // Start and wait until the browser is ready
        try {
            await browser.init();
        } catch (e) {
            // Re-throw to prevent further execution
            console.error(`[universe:e2e] Cannot init WebdriverIO session: ${e.message}`);
            throw e;
        }

        // Run the tests using Mocha
        mocha.run(async errorCount => {
            // Close all browser sessions
            try {
                await browser.endAll();
            } catch (e) {
                console.error(`[universe:e2e] Cannot close WebdriverIO sessions: ${e.message}`);
            }

            // Stop Selenium
            try {
                selenium.kill();
            } catch (e) {
                console.error(`[universe:e2e] Cannot stop Selenium process: ${e.message}`);
            }

            // In CI mode we stop Meteor, otherwise (watch mode) we leave it as is
            if (process.env.CI) {
                if (errorCount > 0) {
                    process.exit(1);
                } else {
                    process.exit(0);
                }
            }
        });
    });
}

