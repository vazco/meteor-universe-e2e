import Mocha from 'mocha';

// Create new Mocha instance
// TODO: allow customization
export const mocha = new Mocha({
    ui: 'bdd',
    reporter: 'spec',
    timeout: 30000, // 30 sec
    useColors: true
});

// Trick to catch all Mocha "global" functions to a variable
const globals = {};
mocha.suite.emit('pre-require', globals, undefined, mocha);

// If we want to use named exports then we must list all variables
export const {
    before,
    after,
    beforeEach,
    afterEach,
    run,
    context,
    describe,
    xcontext,
    xdescribe,
    specify,
    it,
    xspecify,
    xit
} = globals;
