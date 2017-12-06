import {Meteor} from 'meteor/meteor';
import {onTest, onInterrupt} from 'meteor/universe:test-hooks';

import {mocha} from './lib/mocha';
import {closeAllBrowsers} from './lib/puppeteer';

// Re-expose test-hooks api so that this package could be used as a test driver
export {start} from 'meteor/universe:test-hooks';

// Export mocha functions (describe, it etc.) and other public api
export * from './lib/mocha';
export * from './util';
export {createBrowser} from './lib/puppeteer';
export {onTest, onInterrupt};

// Allow easier context checking
Meteor.isE2E = true;

// In case of Meteor server restart close all browser windows
onInterrupt(closeAllBrowsers);

onTest(done => {
    try {
        // Run the tests using Mocha
        // All tests should be registered in app by now
        mocha.run(async errorCount => {
            // Tests are over, close browsers
            await closeAllBrowsers();

            // End the onTest hook, with an error if some tests failed
            errorCount > 0 ? done(new Error(`Mocha reported ${errorCount} errors`)) : done();
        });
    } catch (e) {
        // Just in case catch any unexpected errors
        done(e);
    }
});
