import {Promise} from 'meteor/promise';
import selenium from 'selenium-standalone';
import {getSettings} from './util';

// Promisify selenium api and log potential errors
const install = options => new Promise((resolve, reject) => {
    selenium.install(options, err => {
        if (err) {
            console.error(`[universe:e2e] Cannot install Selenium: ${err.message}`);
            reject(err);
        } else {
            resolve();
        }
    });
});
const start = options => new Promise((resolve, reject) => {
    selenium.start(options, (err, seleniumProcess) => {
        if (err) {
            console.error(`[universe:e2e] Cannot start Selenium: ${err.message}`);
            reject(err);
        } else {
            resolve(seleniumProcess);
        }
    });
});

/**
 * Prepares and starts selenium process
 * @param {{}} [installOptions] - selenium install options
 * @see https://github.com/vvo/selenium-standalone#seleniuminstallopts-cb
 * @param {{}} [startOptions] - selenium starting options
 * @see https://github.com/vvo/selenium-standalone#seleniumstartopts-cb
 * @return {ChildProcess} spawned selenium process
 */
export async function spawnSelenium ({
    installOptions = {},
    startOptions = {}
} = {}) {
    // Install selenium on the system
    await install({
        ...getSettings('selenium'),
        ...installOptions
    });

    // Spawn Selenium child process
    return await start({
        ...getSettings('seleniumStart'),
        ...startOptions
    });
}
