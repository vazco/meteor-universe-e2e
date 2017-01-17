import {Meteor} from 'meteor/meteor';
import WebdriverIO from 'webdriverio';
import {getSettings} from './util';

// Create browser object
export const browser = WebdriverIO.remote({
    desiredCapabilities: {
        browserName: 'chrome'
    },

    // Set baseUrl so we don't have to it in every test
    // absoluteUrl() returns slash at the and and webdriver require a param without it
    baseUrl: Meteor.absoluteUrl().replace(/\/$/, ''),

    // Overwrite defaults with Meteor settings
    ...getSettings('webdriverio')
});
