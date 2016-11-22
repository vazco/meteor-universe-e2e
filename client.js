import {Meteor} from 'meteor/meteor';

// Allow easier context checking
Meteor.isE2E = true;

// This function is required for test-driver, but we don't need any client-side logic
export function runTests () {}
