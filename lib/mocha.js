import Mocha from 'mocha';
import {getSettings} from './util';

// Create new Mocha instance
export const mocha = new Mocha({
    reporter: 'spec',
    timeout: 30000, // 30 sec
    useColors: true,

    // Overwrite defaults with Meteor settings
    ...getSettings('mocha'),

    // BDD is only supported mode at the moment
    ui: 'bdd'
});

// Trick to catch all Mocha "global" functions to a variable
const globals = {};
mocha.suite.emit('pre-require', globals, undefined, mocha);

// If we want to use named exports then we must list all variables
export const {
    after,
    afterEach,
    before,
    beforeEach,
    context,
    describe,
    it,
    specify,
    xcontext,
    xdescribe,
    xit,
    xspecify
} = globals;
