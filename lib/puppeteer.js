import {Promise} from 'meteor/promise';
import puppeteer from 'puppeteer';
import {closeEmptyTabs} from '../helpers/closeEmptyTabs';

/**
 * Keeps track of all spawned browsers
 * @type {Browser[]}
 * @private
 */
const browsers = [];

/**
 * Create new browser and page instances
 * @param {Boolean} CI - set this value to force CI environment
 * @param {*} launchOptions - options passed to puppeteer launch
 * @param {Boolean} disableDefaultArgs - set to true to ignore default chromium args
 * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
 * @returns {Promise<{browser: Browser, page: Page}>}
 * @public
 */
export const createBrowser = async ({
    isCI = process.env.CI,
    disableDefaultArgs = false,
    launchOptions: {
        args = [],
        ...launchOptions
    } = {}
} = {}) => {
    // Use different defaults based on environment
    const options = Object.assign(isCI ? {
        // Default options for CI mode
        headless: true,
        slowMo: 0,
        args: disableDefaultArgs ? args : [
            '--no-sandbox',
            '--disable-gpu',
            ...args
        ]
    } : {
        // Default options for watch mode
        headless: false,
        slowMo: 20,
        args: disableDefaultArgs ? args : [
            '--disable-infobars', // ignored on recent chromium versions
            ...args
        ]
    }, launchOptions);

    try {
        // Create puppeteer browser instance
        const browser = await puppeteer.launch(options);

        // Keep track of browsers to be able to shut them down later
        browsers.push(browser);

        // Create default page object
        const page = await browser.newPage();

        // Close additional empty pages if any (useful in non-headless mode)
        await closeEmptyTabs({browser});

        return {browser, page};
    } catch (err) {
        console.error(`[universe:e2e] Cannot create browser: ${err.message}`);
        throw err;
    }
};

/**
 * Close all browsers and pages that package are aware of.
 * The browser objects are considered to be disposed and could not be used anymore.
 * @returns {Promise} promise resolved when all browsers are closed
 * @private
 */
export const closeAllBrowsers = () => Promise.all(browsers.map(browser => browser.close()));
