import {Meteor} from 'meteor/meteor';
import {onTest, onInterrupt} from 'meteor/universe:test-hooks';

import {mocha, before, setMochaOptions} from './lib/mocha';
import {createBrowser, closeAllBrowsers} from './lib/puppeteer';

// Allow easier context checking inside tests suites
Meteor.isE2E = true;

// In case of Meteor server restart, close all browser windows
onInterrupt(closeAllBrowsers);

// Re-export test-hooks api so this package could be used as a test driver
export {start} from 'meteor/universe:test-hooks';
export {onTest, onInterrupt};

// Export mocha functions (describe, it etc.) and other public APIs
export * from './lib/mocha';
export {createBrowser} from './lib/puppeteer';

// Export extra helpers
export * from './helpers';

// Prepare bindings for default Puppeteer instances created on setup
export let browser, page;

/**
 * Setup test environment
 * @param {object} [mocha] - custom options for mocha
 * @param {object} [browser] - custom options for createBrowser and puppeteer
 * @param {boolean} [browser.createDefaultBrowser=true] - when true will automatically create new browser
 * @void
 */
export async function setup({
    mocha: mochaOptions,
    browser: {
        createDefaultBrowser = true,
        ...browserOptions
    } = {},
} = {}) {
    // Support for custom mocha configuration
    if (mochaOptions) {
        setMochaOptions(mocha, mochaOptions);
    }

    // Create default browser instance before the tests
    if (createDefaultBrowser) {
        before(async () => ({browser, page} = await createBrowser(browserOptions)));
    }

    onTest(done => {
        // Run the tests using Mocha
        // All tests should be registered in app by now
        mocha.run(async errorCount => {
            // Tests are over, close browsers
            await closeAllBrowsers();

            // End the onTest hook, with an error if some tests failed
            errorCount > 0 ? done(new Error(`Mocha reported ${errorCount} errors`)) : done();
        });
    });
}
