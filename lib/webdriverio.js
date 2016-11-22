import WebdriverIO from 'webdriverio';

// Create browser object
// TODO: allow customization
export const browser = WebdriverIO.remote({
    desiredCapabilities: {
        browserName: 'chrome'
    },

    // Set baseUrl so we don't have to it in every test
    // absoluteUrl() returns slash at the and and webdriver require a param without it
    baseUrl: Meteor.absoluteUrl().replace(/\/$/, '')
});
