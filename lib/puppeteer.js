import {Promise} from 'meteor/promise';
import puppeteer from 'puppeteer';

/**
 * Keeps track of all spawned browsers
 * @type {Browser[]}
 * @private
 */
const browsers = [];

/**
 * Create new browser and page instances
 * @param {*} options - options passed to puppeteer launch
 * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
 * @returns {Promise<{browser: Browser, page: Page}>}
 * @public
 */
export const createBrowser = async ({args = [], ...options} = {}) => {

    // Use different defaults based on environment
    const settings = process.env.CI ? {
        headless: true,
        slowMo: 0,
        args: [
            '--no-sandbox',
            '--disable-gpu',
            ...args
        ]
    } : {
        headless: false,
        slowMo: 100,
        args: [
            '--disable-infobars',
            ...args
        ]
    };

    try {
        // Create puppeteer browser and page objects
        const browser = await puppeteer.launch({...settings, ...options});
        const page = await browser.newPage();

        // Keep track of browsers to be able to shut them down later
        browsers.push(browser);

        // Close additional empty pages if any (useful in non-headless mode)
        browser._connection
            .send('Target.getTargets')
            .then(({targetInfos}) => targetInfos
                .filter(({url}) => url === 'chrome://newtab/')
                .forEach(({targetId}) => browser._connection.send('Target.closeTarget', {targetId}))
            );

        return {browser, page};
    } catch (e) {
        console.error(`[universe:e2e] Cannot create browser: ${e.message}`);
        throw e;
    }
};

/**
 * Close all browsers and pages that package are aware of.
 * The browser objects are considered to be disposed and could not be used anymore.
 * @returns {Promise} promise resolved when all browsers are closed
 * @private
 */
export const closeAllBrowsers = () => Promise.all(browsers.map(browser => browser.close()));
