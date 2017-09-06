import puppeteer from 'puppeteer';

import {getSettings} from './util';

/**
 * Create new browser instance
 * @param {Object} options - options passed to puppeteer
 * @see https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
 * @returns {Promise.<Browser>}
 */
export async function createBrowser (options = {}) {
    try {
        return await puppeteer.launch({
            headless: false,
            ...getSettings('puppeteer'),
            ...options
        });
    } catch (e) {
        console.error(`[universe:e2e] Cannot create browser: ${e.message}`);
        throw e;
    }
}
