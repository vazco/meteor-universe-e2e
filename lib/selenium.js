import {Promise} from 'meteor/promise';
import selenium from 'selenium-standalone';

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
    // TODO: set some sane defaults and allow customization (Meteor.settings?)

    // Install selenium on the system
    await install(installOptions);

    // Spawn Selenium child process
    return await start(startOptions);
}
