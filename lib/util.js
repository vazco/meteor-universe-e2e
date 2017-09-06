import {Meteor} from 'meteor/meteor';

/**
 * Retrieves config from Meteor E2E settings
 * @param {String} key - get settings from given section
 * @return {Object} settings object
 */
export const getSettings = (key = '') => {
    const {[key]: value = {}} = Meteor.settings['universe:e2e'] || {};
    return value;
};
