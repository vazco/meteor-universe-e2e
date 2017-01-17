import {Meteor} from 'meteor/meteor';

/**
 * Retrieves config from Meteor E2E settings
 * @param {string} key
 * @return {{}}
 */
export const getSettings = (key = '') => {
    const {[key]: value = {}} = Meteor.settings['universe:e2e'] || {};
    return value;
};