import {Meteor} from 'meteor/meteor';

// Retrieves config from Meteor settings
export const getSettings = service => {
    try {
        // Not very sophisticated... better solution may be introduced in the future
        return Meteor.settings['universe:e2e'][service] || {};
    } catch (e) {
        return {};
    }
};